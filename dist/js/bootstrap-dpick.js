export default class BootstrapDPick {
    constructor(containerClassName, options) {
        this.startDayElement = null;
        this.endDayElement = null;
        this.startDate = null; // Store as ISO string
        this.endDate = null; // Store as ISO string
        this.options = {
            inputDateStartName: "inputDateStartName",
            inputDateEndName: "inputDateEndName",
        };
        this.options = options;
        this.currentDate = new Date();
        // Use querySelector to select the first element that matches the class name
        const containerElement = document.querySelector(`.${containerClassName}`);
        if (!containerElement) {
            throw new Error(`Container element with class ${containerClassName} not found.`);
        }
        this.container = containerElement;
        this.render();
        // events
        this.startDateChangeEvent = new CustomEvent('startDateChange', { detail: {} });
        this.endDateChangeEvent = new CustomEvent('endDateChange', { detail: {} });
    }
    render() {
        this.container.innerHTML = ''; // Clear previous content
        this.renderHeader();
        this.renderBody();
        this.renderFooter();
        this.actionBody();
    }
    renderHeader() {
        const header = document.createElement('div');
        header.className = 'dpick-header d-flex gap-3 align-items-center';
        this.container.appendChild(header);
        const title = document.createElement('div');
        title.className = 'dpick-header-title flex-grow-1 fw-bold';
        // Change 'long' to 'short' for the month format
        title.textContent = this.currentDate.toLocaleDateString('default', { month: 'short', year: 'numeric' });
        header.appendChild(title);
        const actions = document.createElement('div');
        actions.className = 'dpick-header-actions gap-3 d-flex';
        header.appendChild(actions);
        const prevMonthButton = document.createElement('div');
        prevMonthButton.className = 'dpick-previous-month';
        prevMonthButton.innerHTML = 'Prev';
        prevMonthButton.onclick = () => this.changeMonth(-1);
        actions.appendChild(prevMonthButton);
        const nextMonthButton = document.createElement('div');
        nextMonthButton.className = 'dpick-next-month';
        nextMonthButton.innerHTML = 'Next';
        nextMonthButton.onclick = () => this.changeMonth(1);
        actions.appendChild(nextMonthButton);
    }
    renderBody() {
        const body = document.createElement('div');
        body.className = 'dpick-body d-grid gap-3';
        this.container.appendChild(body);
        // Weekdays header
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const daysHeader = document.createElement('div');
        daysHeader.className = 'd-flex gap-3';
        daysOfWeek.forEach(day => {
            const dayDescription = document.createElement('div');
            dayDescription.className = 'dpick-day-description';
            dayDescription.textContent = day;
            daysHeader.appendChild(dayDescription);
        });
        body.appendChild(daysHeader);
        // Days of the month
        let weekContainer = document.createElement('div'); // Container for each week
        weekContainer.className = 'd-flex gap-3';
        // Calculate days to render
        const firstDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInPreviousMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0).getDate();
        // Calculate the previous and next month's "filler" days
        const prevMonthFillerDays = firstDayOfMonth.getDay(); // Sun = 0, Mon = 1, ..., Sat = 6
        const totalDays = lastDayOfMonth.getDate();
        const totalCells = Math.ceil((prevMonthFillerDays + totalDays) / 7) * 7; // Total cells to create a complete grid
        // Render days (including filler days)
        for (let i = 0; i < totalCells; i++) {
            if (i % 7 === 0 && i > 0) { // After every 7 days, start a new row
                body.appendChild(weekContainer); // Append the previous week row
                weekContainer = document.createElement('div'); // Create a new container for the next week
                weekContainer.className = 'd-flex gap-3';
            }
            const dayCell = document.createElement('div');
            dayCell.className = 'dpick-day';
            // Calculate the date for each cell
            let date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i - prevMonthFillerDays + 1);
            let dateText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            // For previous month's filler days
            if (i < prevMonthFillerDays) {
                dayCell.classList.add('opacity-50');
                // Adjust the date for filler days from the previous month
                date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, daysInPreviousMonth - prevMonthFillerDays + 1 + i);
                dateText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }
            // For next month's filler days
            else if (i >= prevMonthFillerDays + totalDays) {
                dayCell.classList.add('opacity-50');
                // Adjust the date for filler days from the next month
                date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, i - (prevMonthFillerDays + totalDays) + 1);
                dateText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }
            // Setting the day number and data-date attribute
            dayCell.textContent = date.getDate().toString();
            dayCell.setAttribute('data-date', dateText);
            weekContainer.appendChild(dayCell);
        }
        body.appendChild(weekContainer); // Append the last week container
        // After creating and appending all day cells
        if (this.startDate) {
            const startDayCell = this.container.querySelector(`.dpick-day[data-date="${this.startDate}"]`);
            if (startDayCell) {
                startDayCell.classList.add('dpick-day-start');
                this.startDayElement = startDayCell;
            }
        }
        if (this.endDate) {
            const endDayCell = this.container.querySelector(`.dpick-day[data-date="${this.endDate}"]`);
            if (endDayCell) {
                endDayCell.classList.add('dpick-day-end');
                this.endDayElement = endDayCell;
            }
        }
    }
    renderFooter() {
        const footer = document.createElement('div');
        footer.className = 'dpick-footer d-grid gap-3';
        this.container.appendChild(footer);
        const hr = document.createElement('hr');
        hr.className = 'border-1 m-0';
        footer.appendChild(hr);
        const footerActions = document.createElement('div');
        footerActions.className = 'dpick-footer-actions d-grid gap-3';
        footer.appendChild(footerActions);
        // Start actions
        const footerActionsStart = document.createElement('div');
        footerActionsStart.className = 'dpick-footer-actions-start d-flex';
        footerActions.appendChild(footerActionsStart);
        const titleStart = document.createElement('div');
        titleStart.className = 'dpick-footer-actions-title flex-grow-1 fw-bold';
        titleStart.textContent = 'Start';
        footerActionsStart.appendChild(titleStart);
        const dateStart = document.createElement('div');
        dateStart.className = 'dpick-footer-actions-date opacity-50';
        dateStart.textContent = ''; // This could be dynamic based on your needs
        footerActionsStart.appendChild(dateStart);
        const inputStart = document.createElement('input');
        inputStart.className = 'dpick-footer-action-input';
        inputStart.setAttribute('type', 'hidden');
        inputStart.setAttribute('name', this.options.inputDateStartName);
        footerActionsStart.appendChild(inputStart);
        // End actions
        const footerActionsEnd = document.createElement('div');
        footerActionsEnd.className = 'dpick-footer-actions-end d-flex';
        footerActions.appendChild(footerActionsEnd);
        const titleEnd = document.createElement('div');
        titleEnd.className = 'dpick-footer-actions-title flex-grow-1 fw-bold';
        titleEnd.textContent = 'End';
        footerActionsEnd.appendChild(titleEnd);
        const dateEnd = document.createElement('div');
        dateEnd.className = 'dpick-footer-actions-date opacity-50';
        dateEnd.textContent = ''; // This could also be dynamic
        footerActionsEnd.appendChild(dateEnd);
        const inputEnd = document.createElement('input');
        inputEnd.className = 'dpick-footer-action-input';
        inputEnd.setAttribute('type', 'hidden');
        inputEnd.setAttribute('name', this.options.inputDateEndName);
        footerActionsEnd.appendChild(inputEnd);
        if (this.startDate) {
            const startInput = this.container.querySelector('.dpick-footer-actions-start .dpick-footer-action-input');
            const startDateObj = new Date(this.startDate);
            const startActionDateElement = this.container.querySelector('.dpick-footer-actions-start .dpick-footer-actions-date');
            if (startActionDateElement)
                startActionDateElement.textContent = startDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (startInput)
                startInput.value = this.startDate;
        }
        if (this.endDate) {
            const endInput = this.container.querySelector('.dpick-footer-actions-end .dpick-footer-action-input');
            const endDateObj = new Date(this.endDate);
            const endActionDateElement = this.container.querySelector('.dpick-footer-actions-end .dpick-footer-actions-date');
            if (endActionDateElement)
                endActionDateElement.textContent = endDateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (endInput)
                endInput.value = this.endDate;
        }
    }
    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.render();
    }
    resetSelections() {
        // Clear the class names for start and end day elements if they exist
        if (this.startDayElement) {
            this.startDayElement.classList.remove('dpick-day-start');
        }
        if (this.endDayElement) {
            this.endDayElement.classList.remove('dpick-day-end');
        }
        // Reset the start and end day elements to null
        this.startDayElement = null;
        this.endDayElement = null;
        // Clear the displayed start and end dates
        const startActionDateElement = this.container.querySelector('.dpick-footer-actions-start .dpick-footer-actions-date');
        const endActionDateElement = this.container.querySelector('.dpick-footer-actions-end .dpick-footer-actions-date');
        if (startActionDateElement)
            startActionDateElement.textContent = '';
        if (endActionDateElement)
            endActionDateElement.textContent = '';
        // Reset the values of the hidden inputs for start and end dates
        const startInput = this.container.querySelector('.dpick-footer-actions-start .dpick-footer-action-input');
        const endInput = this.container.querySelector('.dpick-footer-actions-end .dpick-footer-action-input');
        if (startInput)
            startInput.value = '';
        if (endInput)
            endInput.value = '';
        // Optionally, you can dispatch custom events here to notify about the reset
        // This is useful if other parts of your application need to react to the reset action
        // this.container.dispatchEvent(new CustomEvent('dateReset', { detail: {} }));
    }
    actionBody() {
        // Method to reset selections
        const startActionDateElement = this.container.querySelector('.dpick-footer-actions-start .dpick-footer-actions-date');
        const endActionDateElement = this.container.querySelector('.dpick-footer-actions-end .dpick-footer-actions-date');
        const startInput = this.container.querySelector('.dpick-footer-actions-start .dpick-footer-action-input');
        const endInput = this.container.querySelector('.dpick-footer-actions-end .dpick-footer-action-input');
        const resetSelections = () => {
            if (this.startDayElement)
                this.startDayElement.classList.remove('dpick-day-start');
            if (this.endDayElement)
                this.endDayElement.classList.remove('dpick-day-end');
            this.startDayElement = null;
            this.endDayElement = null;
            if (startActionDateElement)
                startActionDateElement.textContent = '';
            if (endActionDateElement)
                endActionDateElement.textContent = '';
            if (startInput)
                startInput.value = ''; // Reset the input values
            if (endInput)
                endInput.value = '';
        };
        // Method to handle day clicks
        const handleDayClick = (dayElement) => {
            // Assuming each dayElement has a data attribute (e.g., data-date="2023-11-22") representing its date
            const selectedDate = new Date(dayElement.dataset.date);
            const formattedDate = selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            if (!dayElement.classList.contains('opacity-50') && dayElement !== this.startDayElement && dayElement !== this.endDayElement) {
                if (!this.startDayElement) {
                    // First selection - mark as start day
                    this.startDate = dayElement.dataset.date;
                    this.startDayElement = dayElement;
                    dayElement.classList.add('dpick-day-start');
                    if (startActionDateElement)
                        startActionDateElement.textContent = formattedDate; // Display the date
                    if (startInput)
                        startInput.value = dayElement.dataset.date; // Set input value
                    this.container.dispatchEvent(new CustomEvent('startDateChange', { detail: { date: dayElement.dataset.date } }));
                }
                else if (!this.endDayElement) {
                    // Prevent setting an end date before the start date
                    this.endDate = dayElement.dataset.date;
                    if (this.startDayElement && new Date(this.startDayElement.dataset.date) >= selectedDate) {
                        alert("End date cannot be before start date.");
                        return; // Exit the function to avoid setting an end date before the start date
                    }
                    // Second selection - mark as end day
                    this.endDayElement = dayElement;
                    dayElement.classList.add('dpick-day-end');
                    if (endActionDateElement)
                        endActionDateElement.textContent = formattedDate; // Display the date
                    if (endInput)
                        endInput.value = dayElement.dataset.date; // Set input value
                    this.container.dispatchEvent(new CustomEvent('endDateChange', { detail: { date: dayElement.dataset.date } }));
                }
                else {
                    // Third selection - reset and start anew
                    this.resetSelections();
                }
            }
        };
        // Adding click event listeners to each day element
        this.container.querySelectorAll('.dpick-day:not(.opacity-50)').forEach(day => {
            day.addEventListener('click', () => handleDayClick(day));
        });
    }
    onStartDateChange(listener) {
        this.container.addEventListener('startDateChange', listener);
    }
    onEndDateChange(listener) {
        this.container.addEventListener('endDateChange', listener);
    }
}
