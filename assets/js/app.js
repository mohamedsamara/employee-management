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
              '"><td class="hidden">' +
              i +
              '</td><td>' +
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
              '</td><td><button class="btn btn-danger btn-xs delete" data-title="Delete"><i class="far fa-trash-alt"></i></button><button class="btn btn-primary btn-xs edit" data-title="Edit"><i class="far fa-edit"></i></button></td></tr>';

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
    var rate = $('#rate').val();
    var formattedDate = new Date(date);
    var timeNow = new Date();
    var monthsWorked = getMonthsDifference(formattedDate, timeNow);
    var totalBill = getTotalBill(monthsWorked, rate);

    // construct an object ready to be sent to the database
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

  // edit employee
  $(document).on('click', '.edit', function() {
    var employeeKeys = [
      'id',
      'name',
      'role',
      'start_date',
      'months_worked',
      'rate',
      'total_bill'
    ];

    var employeeInputs = {
      id: '',
      name: '',
      role: '',
      start_date: '',
      months_worked: 0,
      rate: 0,
      total_bill: 0
    };

    $('#editEmployeeModal').modal();

    $(this)
      .parents('tr')
      .find('td:not(:last-child)')
      .each(function(e) {
        employeeInputs[employeeKeys[e]] = $(this).text();

        $('#employeeId').val(employeeInputs.id);
        $('#editEmployeeName').val(employeeInputs.name);
        $('#editRole').val(employeeInputs.role);
        $('#editStartDate').val(employeeInputs.start_date);
        $('#editRate').val(employeeInputs.rate);
      });

    $('#edit-employee').on('submit', function(e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      var name = $('#editEmployeeName').val();
      var role = $('#editRole').val();
      var date = $('#editStartDate').val();
      var rate = $('#editRate').val();
      var formattedDate = new Date(date);
      var timeNow = new Date();
      var monthsWorked = getMonthsDifference(formattedDate, timeNow);
      var totalBill = getTotalBill(monthsWorked, rate);

      var employeeId = $('#employeeId').val();

      // construct an object ready to be sent to the database
      var updatedEmployee = {
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
        .child(employeeId)
        .update(updatedEmployee)
        .then(function() {
          console.log('update succeeded');
          $('#editEmployeeModal').modal('toggle');
          $('#editEmployeeName').val('');
          $('#editRole').val('');
          $('#editStartDate').val('');
          $('#editRate').val('');
        })
        .catch(function(error) {
          console.log('update failed: ' + error.message);
        });
    });
  });

  // delete employee
  $(document).on('click', '.delete', function() {
    var id = $(this)
      .parents('tr')
      .attr('id');

    firebase
      .database()
      .ref('/employee/new')
      .child(id)
      .remove()
      .then(function() {
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
