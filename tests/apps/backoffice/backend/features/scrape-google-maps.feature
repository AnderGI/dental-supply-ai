Feature: Register Clients
  I want to register my clients via PUT requests

  Scenario: Happy Path
    Given I send a POST request to "/businesses" with JSON request body:
    """
    {
      "industry": "Clinica Dental",
      "gmail": "johndoe@example.com",
      "city": "Getxo"
    }
    """
    Then the response status code should be 202
    Then the response body should be empty
