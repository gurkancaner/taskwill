Accounts.onCreateUser(function(options, user) {
    user.role = "volunteer";//volunteer, requester, manager
  return user;
});