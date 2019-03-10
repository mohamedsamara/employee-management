$(document).ready(function() {
  // add employee row to employee table
  $('#add-employee').on('submit', function(e) {
    e.preventDefault();

    var name = $('#employeeName').val();
    var role = $('#role').val();
    var date = $('#startDate').val();
    var formattedDate = new Date(date);
    var rate = $('#rate').val();
    var timeNow = new Date();
    var monthsWorked = getMonthsDifference(formattedDate, timeNow);
    var totalBill = getTotalBill(monthsWorked, rate);

    var markup =
      '<tr><td>' +
      name +
      '</td><td>' +
      role +
      '</td><td>' +
      date +
      '</td><td>' +
      monthsWorked +
      '</td><td>' +
      rate +
      '</td><td>' +
      totalBill +
      '$' +
      '</td></tr>';

    $('.employee-table tbody').append(markup);
  });

  // get total billed
  var getTotalBill = function(monthsWorked, rate) {
    return monthsWorked * rate;
  };

  // get months difference
  var getMonthsDifference = function(d1, d2) {
    var months;

    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };
});
