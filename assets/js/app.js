$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyCUOpfYe9sBD7_e30Cg_-CrPb0iaLJOW4U',
    authDomain: 'employee-management-5bdc0.firebaseapp.com',
    databaseURL: 'https://employee-management-5bdc0.firebaseio.com',
    projectId: 'employee-management-5bdc0',
    storageBucket: 'employee-management-5bdc0.appspot.com',
    messagingSenderId: '243267298051'
  };
  firebase.initializeApp(config);

  // load data into employee table
  var getEmployees = function() {
    firebase
      .database()
      .ref('/employee/')
      .once('value')
      .then(function(snapshot) {
        $.each(snapshot.val().new, function(i, value) {
          var markup =
            '<tr><td>' +
            value.name +
            '</td><td>' +
            value.role +
            '</td><td>' +
            value.start_date +
            '</td><td>' +
            value.months_worked +
            '</td><td>' +
            value.rate +
            '</td><td>' +
            value.total_bill +
            ' $' +
            '</td></tr>';

          $('.employee-table tbody').append(markup);
        });
      });
  };

  getEmployees();

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

    // construct an object ready to be sent to database
    var newEmployee = {
      name: name,
      role: role,
      start_date: date,
      rate: rate,
      months_worked: monthsWorked,
      total_bill: totalBill
    };

    firebase
      .database()
      .ref('/employee/new')
      .push(newEmployee, function(error) {
        if (error) {
          console.log('error', error);

          // The write failed...
        } else {
          // Data saved successfully!
          console.log('data saved successfully!');
        }
      });

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
      ' $' +
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
