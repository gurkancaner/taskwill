# Authorization

Authorization module for meteor. User have roles, roles have permissions.

## Requirements

* Every permission on the system should be hard coded in Role.AuthorizationPermissions object in role.js file.
* User should have a role that have manageRoles permission to create roles.
* User should have a role that have manageUsers permission to assign a role to a user.