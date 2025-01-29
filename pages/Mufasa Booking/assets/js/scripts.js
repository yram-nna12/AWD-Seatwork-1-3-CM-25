document.addEventListener("DOMContentLoaded", () => {
    const seats = document.querySelectorAll(".seat");
    const selectedSeatDisplay = document.getElementById("selectedSeat");
    const submitButton = document.querySelector(".submit-btn");
    const locationSelect = document.getElementById("location");
    const dateSelect = document.getElementById("date");
    const timeSelect = document.getElementById("time");
    const paymentMethod = document.getElementById("payment");
    const emailInput = document.getElementById("email");

    // Modal elements
    const modal = document.getElementById("instructionModal");
    const closeBtn = document.querySelector(".close-btn");

    function getReservationKey() {
        return `${locationSelect.value}-${dateSelect.value}-${timeSelect.value}`;
    }

    function loadReservedSeats() {
        const reservationKey = getReservationKey();
        const reservations = JSON.parse(localStorage.getItem("reservations")) || {};

        // Reset all seats before applying reservations
        seats.forEach(seat => {
            seat.classList.remove("occupied", "selected");
            seat.style.pointerEvents = "auto"; // Make selectable again
        });

        // Apply occupied status from localStorage
        if (reservations[reservationKey]) {
            reservations[reservationKey].forEach(seatId => {
                const seat = document.getElementById(seatId);
                if (seat) {
                    seat.classList.add("occupied");
                    seat.style.pointerEvents = "none"; // Disable clicking on reserved seats
                }
            });
        }

        // Clear selected seats display
        selectedSeatDisplay.textContent = "None";
    }

    // Update seats when location, date, or time changes
    locationSelect.addEventListener("change", loadReservedSeats);
    dateSelect.addEventListener("change", loadReservedSeats);
    timeSelect.addEventListener("change", loadReservedSeats);

    seats.forEach(seat => {
        seat.addEventListener("click", () => {
            if (seat.classList.contains("occupied")) {
                alert("This seat is already reserved.");
                return;
            }

            seat.classList.toggle("selected");

            const selectedSeats = document.querySelectorAll(".seat.selected");
            const selectedSeatIds = Array.from(selectedSeats).map(seat => seat.id);
            selectedSeatDisplay.textContent = selectedSeatIds.length > 0 ? selectedSeatIds.join(", ") : "None";
        });
    });

    submitButton.addEventListener("click", () => {
        const selectedSeatIds = Array.from(document.querySelectorAll(".seat.selected")).map(seat => seat.id);
        const email = emailInput.value;
        const payment = paymentMethod.value;

        if (selectedSeatIds.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        if (!email) {
            alert("Please enter your email.");
            return;
        }

        const reservationKey = getReservationKey();
        let reservations = JSON.parse(localStorage.getItem("reservations")) || {};

        if (!reservations[reservationKey]) {
            reservations[reservationKey] = [];
        }

        selectedSeatIds.forEach(seatId => {
            if (!reservations[reservationKey].includes(seatId)) {
                reservations[reservationKey].push(seatId);
            }
        });

        localStorage.setItem("reservations", JSON.stringify(reservations));

        // Update UI
        loadReservedSeats();

        // Show modal with booking details (without price)
        document.getElementById("modal-location").textContent = locationSelect.value;
        document.getElementById("modal-date").textContent = dateSelect.value;
        document.getElementById("modal-time").textContent = timeSelect.value;
        document.getElementById("modal-seats").textContent = selectedSeatIds.join(", ");
        document.getElementById("modal-payment").textContent = payment;
        modal.style.display = "block";

        alert("Reservation successful!");
    });

    // Modal functionality
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    function setDefaultDate() {
        if (!dateSelect.value) {  
            const today = new Date().toISOString().split("T")[0];
            dateSelect.value = today;
        }
    }
    setDefaultDate();

    loadReservedSeats();

    // Reset seats at midnight
    function resetSeatsAtMidnight() {
        const now = new Date();
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0);

        const timeUntilMidnight = nextMidnight - now;

        setTimeout(() => {
            localStorage.removeItem("reservations");
            loadReservedSeats();
        }, timeUntilMidnight);
    }

    resetSeatsAtMidnight();
});
