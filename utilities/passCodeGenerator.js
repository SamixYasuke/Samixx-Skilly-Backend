const passCodeGenerator = () => {
  const randomCode = Math.floor(100000 + Math.random() * 900000);
  const sixDigitCode = randomCode.toString();
  return sixDigitCode;
};

export default passCodeGenerator;
