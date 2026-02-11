export type EmailAlreadyExistsError = Error & {
  name: "EmailAlreadyExistsError";
  email: string;
};

export function createEmailAlreadyExistsError(
  email: string,
): EmailAlreadyExistsError {
  const err = new Error(
    `O e-mail ${email} já está cadastrado.`,
  ) as EmailAlreadyExistsError;
  err.name = "EmailAlreadyExistsError";
  err.email = email;
  return err;
}
