var LOVEABLE_TOKEN    = 'S7LUvYpHyXSG6EKZgN3xnvpvXuGkz6V2sX5xPR3vE';
var LOVEABLE_ENDPOINT = 'https://preview--hubble-blossom-connect.lovable.app/api/public/agent-updates';

function sendWeeklySummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var today     = new Date();
  var weekStart = new Date(today);
  weekStart.setDate(today.getDate() - 7);

  var fmt      = Utilities.formatDate;
  var tz       = ss.getSpreadsheetTimeZone();
  var startStr = fmt(weekStart, tz, 'yyyy-MM-dd');
  var endStr   = fmt(today,     tz, 'yyyy-MM-dd');

  var transactions   = getSheetData(ss, 'Transactions');
  var bookings       = getSheetData(ss, 'Bookings');
  var boutiqueOrders = getSheetData(ss, 'Boutique Orders');
  var members        = getSheetData(ss, 'Members');
  var retainers      = getSheetData(ss, 'Retainers');

  var completedTxns = transactions.filter(function(t) {
    return t['Payment Status'] === 'completed' &&
           t['Date'] >= startStr && t['Date'] <= endStr;
  });

  var clubRevenue   = sumField(completedTxns.filter(function(t) {
    return t['Source Site'] === 'sxyscorporateclub.com';
  }), 'Sale Amount');

  var publicRevenue = sumField(completedTxns.filter(function(t) {
    return t['Source Site'] === 'sxysinvestors.com';
  }), 'Sale Amount');

  var totalRevenue  = clubRevenue + publicRevenue;
  var totalFees     = sumField(completedTxns, 'Platform Fee');

  var weekOrders  = boutiqueOrders.filter(function(o) {
    return o['Order Date'] >= startStr && o['Order Date'] <= endStr;
  });
  var boutiqueRev = sumField(weekOrders, 'Order Total');

  var activeRetainers = retainers.filter(function(r) {
    return (r['Status'] || '').toLowerCase() === 'active';
  });
  var mrr = activeRetainers.length * 300;

  var activeMembers = members.filter(function(m) {
    return (m['Status'] || '').toLowerCase() === 'active';
  }).length;

  var vipMembers = members.filter(function(m) {
    return (m['Membership Tier'] || '').toUpperCase() === 'VIP' &&
           (m['Status'] || '').toLowerCase() === 'active';
  }).length;

  var newMembers = members.filter(function(m) {
    return m['Join Date'] >= startStr && m['Join Date'] <= endStr;
  }).length;

  var weekBookings = bookings.filter(function(b) {
    return b['Booking Date'] >= startStr && b['Booking Date'] <= endStr;
  });
  var converted = weekBookings.filter(function(b) {
    return (b['Converted to Member'] || '').toString().toUpperCase() === 'TRUE';
  }).length;

  var summary = [
    'WEEKLY FINANCIAL SUMMARY — ' + startStr + ' to ' + endStr,
    '',
    'REVENUE',
    '  Total: ' + money(totalRevenue),
    '  sxyscorporateclub.com: ' + money(clubRevenue),
    '  sxysinvestors.com: '     + money(publicRevenue),
    '  Platform fees collected: ' + money(totalFees),
    '',
    'BOUTIQUE',
    '  Orders: ' + weekOrders.length,
    '  Revenue: ' + money(boutiqueRev),
    '',
    'STRATEGY SESSIONS',
    '  Booked: ' + weekBookings.length,
    '  Converted to members: ' + converted,
    '',
    'MEMBERS',
    '  Active: ' + activeMembers,
    '  New this week: ' + newMembers,
    '  VIP: ' + vipMembers,
    '',
    'RETAINERS',
    '  Active: ' + activeRetainers.length,
    '  MRR: ' + money(mrr),
  ].join('\n');

  var payload = {
    title:        'Week of ' + startStr + ' — Financial Summary',
    summary:      summary,
    period_start: startStr,
    period_end:   endStr,
    metrics: {
      revenue:          round(totalRevenue),
      boutique_revenue: round(boutiqueRev),
      platform_fees:    round(totalFees),
      mrr:              mrr,
      active_members:   activeMembers,
      new_members:      newMembers,
      vip_members:      vipMembers,
      bookings:         weekBookings.length,
      conversions:      converted,
      active_retainers: activeRetainers.length,
    },
    source: 'claude-agent',
  };

  var options = {
    method:      'post',
    contentType: 'application/json',
    headers:     { 'Authorization': 'Bearer ' + LOVEABLE_TOKEN },
    payload:     JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(LOVEABLE_ENDPOINT, options);
  var code     = response.getResponseCode();

  if (code === 200 || code === 201) {
    Logger.log('Weekly summary posted successfully.');
  } else {
    Logger.log('Error: ' + code + ' — ' + response.getContentText());
  }
}

function setWeeklyTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'sendWeeklySummary') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('sendWeeklySummary')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(8)
    .create();
  Logger.log('Weekly trigger set. Summary will post every Monday at 8am.');
}

function getSheetData(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  var data  = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  return data.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) { obj[h] = row[i] !== undefined ? String(row[i]) : ''; });
    return obj;
  });
}

function sumField(rows, field) {
  return rows.reduce(function(sum, row) {
    return sum + (parseFloat(row[field]) || 0);
  }, 0);
}

function money(n) {
  return '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function round(n) {
  return Math.round(n * 100) / 100;
}
