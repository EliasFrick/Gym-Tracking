# E2E Testing with Maestro

This folder contains E2E (End-to-End) tests for the GymFlow AI application using Maestro.

## Test Files

- `login.yml` - Tests login functionality
- `register.yml` - Tests registration functionality
- `home_screen.yml` - Tests home screen functionality
- `profile_screen.yml` - Tests profile screen functionality
- `weight_screen.yml` - Tests weight tracking functionality
- `ranking_screen.yml` - Tests leaderboard functionality
- `workout_screen.yml` - Tests workout creation functionality
- `workout_details.yml` - Tests workout details view
- `exercises_modal.yml` - Tests exercises management modal
- `run_all_tests.yml` - Master file that runs all tests sequentially

## Running Tests

You can run individual tests or use the master file to run all tests at once.

### Running a Single Test

```bash
maestro test maestro/login.yml
```

### Running All Tests

```bash
maestro test maestro/run_all_tests.yml
```

## Test Account

Some tests require a valid test account. Make sure to update the test credentials in the login.yml file:

```yaml
- inputText: "test@example.com" # Replace with a valid test account email
- inputText: "password123" # Replace with a valid test account password
```

## Tips for Maintaining Tests

1. **ID-Based Selection**: For more stable tests, add testID props to your React Native components and select them using `id` instead of `text`:

   ```jsx
   <Button testID="login-button" title="Log In" />
   ```

   Then in Maestro:
   ```yaml
   - tapOn:
       id: "login-button"
   ```

2. **Optional Elements**: Use the `optional: true` property for elements that might not always be present:

   ```yaml
   - assertVisible:
       text: "Premium Feature"
       optional: true
   ```

3. **Conditional Flows**: For testing features that depend on certain conditions:

   ```yaml
   - runFlow:
       when:
         visible: "Premium Feature"
       commands:
         - tapOn: "Premium Feature"
         - assertVisible: "Premium Content"
   ```

## Troubleshooting

- If tests fail due to timing issues, add delay commands:
  
  ```yaml
  - extendedWaitUntil:
      visible: "Success"
      timeout: 5000
  ```

- For elements that are hard to select, use combinations of properties:
  
  ```yaml
  - tapOn:
      text: "Submit"
      index: 0
  ```
