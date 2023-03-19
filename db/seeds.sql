INSERT INTO department (name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES  ("Sales Lead", 1000.00, 1),
        ("Software Engineer", 1500.00, 2),
        ("Accountant", 1250.00, 3),
        ("Lawyer", 1900.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ("Tom", "Brady", 1, 1)
        ("Justin", "Herbert", 2, 2)
        ("Kyle", "Murray", 3, 3)
        ("Patrick", "Mahomes", 4, 4);