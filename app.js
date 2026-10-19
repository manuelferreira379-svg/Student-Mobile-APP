
"use strict";

// Storage key used to save student records in the browser.
const STORAGE_KEY = "students";

// Get the HTML elements.
const studentForm = document.getElementById("studentForm");
const studentIdInput = document.getElementById("studentId");
const studentNameInput = document.getElementById("studentName");
const courseInput = document.getElementById("course");
const yearInput = document.getElementById("year");

const studentList = document.getElementById("studentList");
const studentCount = document.getElementById("studentCount");
const emptyMessage = document.getElementById("emptyMessage");
const message = document.getElementById("message");

// Read saved students from localStorage.
function getStudents() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) {
            return [];
        }

        const students = JSON.parse(savedData);

        return Array.isArray(students) ? students : [];
    } catch (error) {
        console.error("Could not read student records:", error);
        showMessage(
            "Unable to read saved records. Check the browser console.",
            "error"
        );
        return [];
    }
}

// Save the student array to localStorage.
function saveStudents(students) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
        return true;
    } catch (error) {
        console.error("Could not save student records:", error);
        showMessage(
            "Unable to save records. Browser storage may be unavailable or full.",
            "error"
        );
        return false;
    }
}

// Display a success or error message.
function showMessage(text, type) {
    message.textContent = text;
    message.className = type === "success"
        ? "message-success"
        : "message-error";
}

// Create a table cell using text, not HTML.
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent = value;
    return cell;
}

// Display all saved students in the table.
function displayStudents() {
    // Clear the old list before drawing it again.
    studentList.replaceChildren();

    const students = getStudents();

    students.forEach(function(student) {
        const row = document.createElement("tr");

        row.appendChild(createCell(student.studentId));
        row.appendChild(createCell(student.name));
        row.appendChild(createCell(student.course));
        row.appendChild(createCell("Year " + student.year));

        // Create the delete button.
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", function() {
            deleteStudent(student.studentId);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);

        // Add the completed row to the visible table.
        studentList.appendChild(row);
    });

    // Update the total number of students.
    studentCount.textContent = "Total students: " + students.length;

    // Show the empty message only when there are no records.
    emptyMessage.hidden = students.length > 0;
}

// Register a new student.
studentForm.addEventListener("submit", function(event) {
    // Stop the browser from reloading the page.
    event.preventDefault();

    // Read and clean the form values.
    const studentId = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const course = courseInput.value.trim();
    const year = yearInput.value;

    // Check that all fields are completed.
    if (!studentId || !name || !course || !year) {
        showMessage("Please complete all fields.", "error");
        return;
    }

    // Read the current records.
    const students = getStudents();

    // Prevent duplicate student IDs, ignoring letter case.
    const duplicate = students.some(function(student) {
        return String(student.studentId).toLowerCase()
            === studentId.toLowerCase();
    });

    if (duplicate) {
        showMessage(
            "A student with this ID is already registered.",
            "error"
        );
        return;
    }

    // Create the new student record.
    const newStudent = {
        studentId: studentId,
        name: name,
        course: course,
        year: year
    };

    // Add the student to the array.
    students.push(newStudent);

    // Save before updating the visible list.
    const saved = saveStudents(students);

    if (!saved) {
        return;
    }

    // IMPORTANT: Refresh the list immediately after saving.
    displayStudents();

    // Clear the form for the next registration.
    studentForm.reset();

    // Display the success message.
    showMessage("Student registered and saved.", "success");
});

// Delete a student using their student ID.
function deleteStudent(studentId) {
    const confirmed = window.confirm(
        "Are you sure you want to delete student " + studentId + "?"
    );

    if (!confirmed) {
        return;
    }

    const students = getStudents();

    const updatedStudents = students.filter(function(student) {
        return String(student.studentId) !== String(studentId);
    });

    const saved = saveStudents(updatedStudents);

    if (!saved) {
        return;
    }

    // Refresh the table after deleting the student.
    displayStudents();

    showMessage("Student record deleted.", "success");
}

// Display saved records whenever the page loads.
document.addEventListener("DOMContentLoaded", function() {
    displayStudents();
});

// Also display the list immediately if this script loads after the HTML.
displayStudents();
