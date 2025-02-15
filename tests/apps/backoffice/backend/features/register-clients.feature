Feature: Register Clients
  I want to register my clients via PUT requests

  Scenario: Happy Path
    Given I send a PUT request to "/clients/9ed3e1f7-36b6-4546-94f7-3d354e4ad8fb" with JSON request body:
    """
    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+123456789",
      "company": "Acme Corp",
      "position": "Sales Manager"
    }
    """
    Then the response status code should be 202
    Then the response body should be empty

  Scenario: Invalid Uuid Path Variable. 
    Given I send a PUT request to "/clients/bhjvgcgcfgcgf" with JSON request body:
    """
    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "+123456789",
      "company": "Acme Corp",
      "position": "Sales Manager"
    }
    """
    Then the response status code should be 400
    Then the response body should be:
    """
    {
      "errors": [
         {
           "msg": "The id param must be a valid UUID",
           "param": "id"
         }
       ]
    }
    """