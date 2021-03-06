const express = require('express');
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const router = express.Router();

router.get("/", (req, res) => {
    res.render("employee/addOrEdit", {
        viewTitle: "Insert Toy"
    })
})

router.post("/", (req, res) => {
    if (req.body._id == "") {
        insertRecord(req, res);
    }
    else {
        updateRecord(req, res);
    }
})

function insertRecord(req, res) {
    var employee = new Employee();
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.city = req.body.city;
    employee.mobile = req.body.mobile;

    employee.save((err, doc) => {
        if (!err) {
            res.redirect('employee/list');
        }
        else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: "Insert Toy",
                    employee: req.body
                })
            }
            console.log("Error occured during record insertion" + err);
        }
    })
}

function updateRecord(req, res) {
    Employee.findOneAndUpdate({ _id: req.body._id, }, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('employee/list');
        }
        else {
            if (err.name == "ValidationError") {
                handleValidationError(err, req.body);
                res.render("employee/addOrEdit", {
                    viewTitle: 'Update Employee',
                    employee: req.body
                });
            }
            else {
                console.log("Error occured in Updating the records" + err);
            }
        }
    })
}

router.get('/list', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            res.render("employee/list", {
                list: docs
            })
        }
    })
})

router.get('/:id', (req, res) => {
    Employee.findById(req.params.id, (err, doc) => {
        if (!err) {
            res.render("employee/addOrEdit", {
                viewTitle: "Update Employee",
                employee: doc
            })
        }
    })
})

router.get('/delete/:id', (req, res) => {
    Employee.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/employee/list');
        }
        else {
            console.log("An error occured during the Delete Process" + err);
        }
    })
})

router.post('/doSearch', async (req, res) => {
    let client = await MongoClient.connect(uri,{
        useUnifiedTopology: true
    });
    let db = client.db('EmployeeDB');
    let collection = db.collection('Employees');

    let name = new RegExp(req.body.search);

    var condition = {
        'name': name
    }

    var employee = await collection.find(condition).toArray();

    const template = handlebars.compile(fs.readFileSync('views/employee/list', 'utf8'));
    const result = template ({
        employee: employees
    }, {
        allowProtoMethodsByDefault: false,
        allowProtoPropertiesByDefault: false
    })

    res.render('layouts/mainLayout.hbs', {
        content: result
    })
})

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;

            case 'email':
                body['emailError'] = err.errors[field].message;
                break;

            default:
                break;
        }
    }
}

module.exports = router;