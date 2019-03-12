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

  // fetch employees data
  var getEmployees = function() {
    firebase
      .database()
      .ref('/employee/')
      .on(
        'value',
        function(snapshot) {
          $('.employee-table tbody').empty();

          $.each(snapshot.val().new, function(i, value) {
            var markup =
              '<tr id="' +
              i +
              '"><td>' +
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
              '</td><td><button class="btn btn-danger btn-xs delete" data-toggle="tooltip" data-title="Delete"><i class="far fa-trash-alt"></i></button></td></tr>';

            $('.employee-table tbody').append(markup);
          });
        },
        function(errorObject) {
          console.log('The read failed: ' + errorObject.code);
        }
      );
  };

  getEmployees();

  // add employee
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
      .push(newEmployee)
      .then(function() {
        $('#addEmployeeModal').modal('toggle');
        $('#employeeName').val('');
        $('#role').val('');
        $('#startDate').val('');
        $('#rate').val('');
        console.log('add succeeded.');
      })
      .catch(function(error) {
        console.log('add failed: ' + error.message);
      });
  });

  // delete employee
  $(document).on('click', '.delete', function() {
    var id = $(this)
      .parents('tr')
      .attr('id');

    var removeNode = $(this).parents('tr');

    firebase
      .database()
      .ref('/employee/new')
      .child(id)
      .remove()
      .then(function() {
        removeNode.remove();
        console.log('Remove succeeded.');
      })
      .catch(function(error) {
        console.log('Remove failed: ' + error.message);
      });
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
