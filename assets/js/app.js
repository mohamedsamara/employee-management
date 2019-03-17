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

  // Create a variable to reference the database
  var database = firebase.database();

  // fetch employees data
  var getEmployees = function() {
    database.ref('/employees').on(
      'value',
      function(snapshot) {
        $('.employee-table tbody').empty();

        $.each(snapshot.val(), function(i, value) {
          var markup =
            '<tr><td class="hidden">' +
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
            '</td><td><button class="btn btn-danger btn-xs delete" data-key="' +
            i +
            '" data-title="Delete"><i class="far fa-trash-alt"></i></button><button class="btn btn-primary btn-xs edit" data-key="' +
            i +
            '" data-title="Edit"><i class="far fa-edit"></i></button></td></tr>';

          $('.employee-table tbody').append(markup);
        });
      },
      function(errorObject) {
        showNotification(errorObject.code, 'danger');
      }
    );
  };

  getEmployees();

  // add employee
  $('#add-employee').on('submit', function(e) {
    e.preventDefault();

    var name = $('#employeeName')
      .val()
      .trim();
    var role = $('#role')
      .val()
      .trim();
    var date = $('#startDate')
      .val()
      .trim();
    var rate = $('#rate')
      .val()
      .trim();
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

    database
      .ref('/employees')
      .push(newEmployee)
      .then(function() {
        $('#addEmployeeModal').modal('toggle');
        $('#employeeName').val('');
        $('#role').val('');
        $('#startDate').val('');
        $('#rate').val('');
        showNotification('Employee successfully added', 'success');
      })
      .catch(function(error) {
        showNotification(error.message, 'danger');
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

      var name = $('#editEmployeeName')
        .val()
        .trim();
      var role = $('#editRole')
        .val()
        .trim();
      var date = $('#editStartDate')
        .val()
        .trim();
      var rate = $('#editRate')
        .val()
        .trim();
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

      database
        .ref('/employees')
        .child(employeeId)
        .update(updatedEmployee)
        .then(function() {
          showNotification('Employee successfully updated', 'success');

          $('#editEmployeeModal').modal('toggle');
          $('#editEmployeeName').val('');
          $('#editRole').val('');
          $('#editStartDate').val('');
          $('#editRate').val('');
        })
        .catch(function(error) {
          showNotification(error.message, 'danger');
        });
    });
  });

  // delete employee
  $(document).on('click', '.delete', function() {
    var id = $(this).attr('data-key');

    database
      .ref('/employees')
      .child(id)
      .remove()
      .then(function() {
        showNotification('Employee successfully removed', 'success');
      })
      .catch(function(error) {
        showNotification(error.message, 'danger');
      });
  });

  // show notification
  var showNotification = function(message, type) {
    $('#message-alerts').html('<p>' + message + '</p>');
    $('#message-alerts').addClass('alert alert-' + type);

    $('#message-alerts')
      .fadeTo(2000, 500)
      .slideUp(500, function() {
        $('#message-alerts').slideUp(500);
      });
  };

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
