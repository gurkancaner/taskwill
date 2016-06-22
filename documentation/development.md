# Development Notes

## Used Libraries

Used libraries briefly explained here

### iron:router

Main routing library

### accounts-password

Used for password based authentication

### tap:i18n

For multilanguage support



### themeteorchef:jquery-validation

For form validation

## Assumptions

* There should be a one super user with maximum level. That user can update other users' level to 1 - his level. Otherwise every user will be at level 0. To create this user you should manually change a super users' level
* There should be a role named "Volunteer" system to work
