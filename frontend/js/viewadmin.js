const backendURL = "https://pococare1.onrender.com/";

document.querySelector(".admin-name").innerHTML = "Hi " + localStorage.getItem("name");

async function fetchDoctors() {
    try {
        const response = await fetch(`${backendURL}doctors/all`);
        const data = await response.json();
        renderDoctors(data.Doctors);
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
}

function renderDoctors(doctors) {
    const doctorsContainer = document.querySelector(".container");
    doctorsContainer.innerHTML = "";

    doctors.forEach(doctor => {
        const doctorCard = document.createElement("div");
        doctorCard.className = "doctor-card";

        const doctorImage = document.createElement("img");
        doctorImage.src = doctor.image;
        doctorImage.alt = `Doctor ${doctor.id}`;
        doctorCard.appendChild(doctorImage);

        const doctorName = document.createElement("h2");
        doctorName.className = "doctor-name";
        doctorName.textContent = doctor.name;
        doctorCard.appendChild(doctorName);

        const doctorEmail = document.createElement("p");
        doctorEmail.className = "doctor-email";
        doctorEmail.textContent = doctor.email;
        doctorCard.appendChild(doctorEmail);

        const doctorSpecialization = document.createElement("p");
        doctorSpecialization.className = "doctor-specialization";
        doctorSpecialization.textContent = "Specialization: " + doctor.specialization;
        doctorCard.appendChild(doctorSpecialization);

        const videoCallAvailability = document.createElement("p");
        videoCallAvailability.className = `change${doctor._id}`;
        videoCallAvailability.textContent = "Video Call Availability: " + doctor.videoCall;
        doctorCard.appendChild(videoCallAvailability);

        const videoToggle = document.createElement("button");
        videoToggle.textContent = "Change Availability";
        videoToggle.className = "doctor-change";

        videoToggle.addEventListener("click", async () => {
            let obj = {
                videoCall: videoCallAvailability.textContent.includes("YES") ? "NO" : "YES",
                role: "admin"
            };

            try {
                const response = await fetch(`${backendURL}doctors/update/${doctor._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                });

                if (response.ok) {
                    alert("Video Call Availability changed");
                    fetchDoctors();
                } else {
                    alert("Error changing availability");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        doctorCard.appendChild(videoToggle);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "doctor-remove";
        removeButton.addEventListener("click", async () => {
            try {
                const response = await fetch(`${backendURL}doctors/delete/${doctor._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ role: "admin" })
                });

                if (response.ok) {
                    alert("Doctor removed");
                    fetchDoctors();
                } else {
                    console.error("Error deleting doctor");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        doctorCard.appendChild(removeButton);
        doctorsContainer.appendChild(doctorCard);
    });
}

async function fetchPatients() {
    try {
        const response = await fetch(`${backendURL}patients/all`);
        const data = await response.json();
        renderPatients(data.Patients);
    } catch (error) {
        console.error("Error fetching patients:", error);
    }
}

function renderPatients(patients) {
    const container = document.querySelector(".container");
    container.innerHTML = "";

    patients.forEach(patient => {
        const patientCard = document.createElement("div");
        patientCard.className = "patient-card";

        const patientImage = document.createElement("img");
        patientImage.src = patient.image;
        patientImage.alt = `Patient ${patient.id}`;
        patientCard.appendChild(patientImage);

        const patientName = document.createElement("h2");
        patientName.className = "patient-name";
        patientName.textContent = "Name: " + patient.name;
        patientCard.appendChild(patientName);

        const patientEmail = document.createElement("p");
        patientEmail.className = "patient-email";
        patientEmail.textContent = "Email: " + patient.email;
        patientCard.appendChild(patientEmail);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "patient-remove";
        removeButton.addEventListener("click", async () => {
            try {
                const response = await fetch(`${backendURL}patients/delete/${patient._id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ role: "admin" })
                });

                if (response.ok) {
                    alert("Patient removed");
                    fetchPatients();
                } else {
                    console.error("Error deleting patient");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        });

        patientCard.appendChild(removeButton);
        container.appendChild(patientCard);
    });
}

async function fetchAppointments() {
    try {
        const response = await fetch(`${backendURL}appointments`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await response.json();
        renderAppointments(data.Appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
    }
}

function renderAppointments(appointments) {
    const container = document.querySelector(".container");
    container.innerHTML = appointments.length ? "" : "No Appointments";

    appointments.forEach(appointment => {
        const appDiv = document.createElement("div");

        const docImage = document.createElement("img");
        docImage.src = appointment.doctorId.image;
        docImage.className = "doctor-image";

        const patientImage = document.createElement("img");
        patientImage.src = appointment.patientId.image;
        patientImage.className = "patient-image";

        const appointmentInfo = document.createElement("p");
        appointmentInfo.textContent = `Doctor: ${appointment.doctorId.name} | Date: ${new Date(appointment.date).toLocaleDateString()} | Time: ${appointment.startTime} - ${appointment.endTime}`;

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "cancel-appointment-btn";
        cancelBtn.textContent = "Cancel";

        cancelBtn.addEventListener("click", async () => {
            if (confirm("Are you sure you want to delete this appointment?")) {
                try {
                    const response = await fetch(`${backendURL}appointments/delete/${appointment._id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });

                    if (response.ok) {
                        alert("Appointment deleted");
                        fetchAppointments();
                    } else {
                        console.error("Failed to delete appointment");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        });

        appDiv.append(docImage, patientImage, appointmentInfo, cancelBtn);
        container.append(appDiv);
    });
}

document.getElementById("viewDoc").addEventListener("click", fetchDoctors);
document.getElementById("viewPat").addEventListener("click", fetchPatients);
document.getElementById("viewApp").addEventListener("click", fetchAppointments);

document.querySelector(".logout-btn").addEventListener("click", () => {
    localStorage.clear();
    alert("Logging you out");
    window.location.href = "./admin.html";
});
