
# Bootstrap-DPick

Bootstrap-DPick is a customizable date range picker built with Bootstrap 5. It allows users to select start and end dates with a visually appealing interface.

## Features

- Select start and end dates
- Customizable via options
- Emits custom events (`startDateChange`, `endDateChange`) for easy integration
- Follows Bootstrap 5 styling guidelines

---

## Installation

Clone this repository or install it via npm:
```bash
npm install bootstrap-dpick
```

---

## Usage

### HTML Structure

Ensure you have a container element where the datepicker will be rendered:
```html
<div class="dpick-container"></div>
```

---

### TypeScript Integration

Import and initialize the datepicker in your TypeScript file:

```typescript
import BootstrapDPick from 'bootstrap-dpick';

const options = {
  inputDateStartName: 'startDate',
  inputDateEndName: 'endDate',
};

// Initialize the datepicker
const datepicker = new BootstrapDPick('dpick-container', options);

// Listen for start date changes
datepicker.onStartDateChange((event) => {
  console.log('Start Date Selected:', event.detail.date);
});

// Listen for end date changes
datepicker.onEndDateChange((event) => {
  console.log('End Date Selected:', event.detail.date);
});
```

---

### Importing SCSS for Customization

To customize the styles, import the SCSS file into your project:

```scss
@import '~bootstrap-dpick/scss/bootstrap-dpick';
```

This allows you to override the default styles by modifying variables or adding custom rules in your SCSS.

Example:
```scss
@import '~bootstrap-dpick/scss/bootstrap-dpick';

.dpick-container {
  .dpick-day {
    background-color: #f0f0f0;

    &.dpick-day-start {
      background-color: #007bff;
      color: #fff;
    }

    &.dpick-day-end {
      background-color: #28a745;
      color: #fff;
    }
  }
}
```

---

### Styles

If you are not using SCSS, include the generated CSS file in your project:
```html
<link rel="stylesheet" href="public/styles.css">
```

---

## Example

### Complete HTML and TypeScript Example
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="public/styles.css">
  <title>Bootstrap-DPick Example</title>
</head>
<body>
  <div class="dpick-container"></div>
  <script type="module">
    import BootstrapDPick from './public/bootstrap-dpick.js';

    const options = {
      inputDateStartName: 'startDate',
      inputDateEndName: 'endDate',
    };

    const datepicker = new BootstrapDPick('dpick-container', options);

    datepicker.onStartDateChange((event) => {
      console.log('Start Date:', event.detail.date);
    });

    datepicker.onEndDateChange((event) => {
      console.log('End Date:', event.detail.date);
    });
  </script>
</body>
</html>
```

---

### SCSS Example
```scss
@import '~bootstrap-dpick/src/scss/main.scss';

.dpick-container {
  border: 1px solid #ccc;
  border-radius: 8px;

  .dpick-header {
    background-color: #007bff;
    color: #fff;
  }

  .dpick-day {
    &:hover {
      background-color: #f8f9fa;
      cursor: pointer;
    }
  }
}
```

---

## Author

Bootstrap-DPick is developed and maintained by **Wetero Service LLC**.

## License

This project is licensed under the ISC License.

---
