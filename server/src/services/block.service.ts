/**
 * Mongo functions for all block objects
 */

const createInvite = async (
  email: string,
  verificationToken: string,
  role: string,
) => {
  const newInvite = new Invite({
    email,
    role,
    verificationToken,
  });
  const invite = await newInvite.save();
  return invite;
};
