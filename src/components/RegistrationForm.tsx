import { useState, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'One number', test: (pwd) => /\d/.test(pwd) },
  { label: 'One special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fields = Object.values(formData);
    const filledFields = fields.filter((field) => field.trim() !== '').length;
    const percentage = (filledFields / fields.length) * 100;
    setCompletionPercentage(percentage);
  }, [formData]);

  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordsMatch(formData.password === formData.confirmPassword);
      if (formData.password !== formData.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: 'Passwords do not match',
        }));
      } else {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.confirmPassword;
          return newErrors;
        });
      }
    } else {
      setPasswordsMatch(true);
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.confirmPassword;
        return newErrors;
      });
    }
  }, [formData.password, formData.confirmPassword]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const allRequirementsMet = passwordRequirements.every((req) =>
      req.test(formData.password)
    );

    if (!allRequirementsMet) {
      newErrors.password = 'Password does not meet all requirements';
    }

    if (!passwordsMatch) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      return;
    }

    setFieldErrors({});
    console.log('Form submitted:', formData);
    alert('Registration successful!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const allRequirementsMet = passwordRequirements.every((req) => req.test(formData.password));

  return (
    <div className="w-full">
      <a
        href="#form-start"
        className="sr-only focus:not-sr-only fixed top-0 left-0 z-50 bg-blue-600 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to registration form
      </a>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sm:p-8">
          <h1 id="form-start" className="text-4xl font-bold text-gray-900 mb-3 focus:outline-none">
            Create Account
          </h1>
          <p className="text-lg text-gray-600 mb-8">Join us today and get started in minutes</p>

        <div className="mb-8" role="region" aria-live="polite" aria-atomic="true" aria-label="Form completion progress">
          <div className="flex justify-between items-center mb-3">
            <span className="text-base font-semibold text-gray-800">Progress</span>
            <span className="text-lg font-bold text-blue-600">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 border border-gray-200 overflow-hidden shadow-sm">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-md"
              style={{ width: `${completionPercentage}%` }}
              role="progressbar"
              aria-valuenow={Math.round(completionPercentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow-text={`${Math.round(completionPercentage)}% form complete`}
              aria-label="Form completion progress out of 100%"
            />
          </div>
          <p className="sr-only" aria-live="assertive" aria-atomic="true">
            Form is {Math.round(completionPercentage)}% complete. {completionPercentage === 100 ? 'All required fields have been filled.' : `Fill in ${4 - Math.ceil((completionPercentage / 25))} more field(s) to proceed.`}
          </p>
        </div>

        <div className="sr-only" role="status" aria-live="assertive" aria-atomic="true">
          {Object.keys(fieldErrors).length > 0 && `${Object.keys(fieldErrors).length} validation error(s) found.`}
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="User registration form">
        <fieldset className="mb-8 border-0 p-0">
          <legend className="sr-only">Account Information - Full Name and Email fields</legend>
          <p className="sr-only">Fields marked with an asterisk (*) are required.</p>

          <div className="mb-6">
            <label
              htmlFor="fullName"
              className="block text-base font-semibold text-gray-800 mb-2"
            >
              Full Name
              <span className="text-red-600 ml-1" aria-label="required">
                *
              </span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none placeholder-gray-400 ${
                fieldErrors.fullName
                  ? 'border-red-600 bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                  : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 hover:border-gray-400'
              }`}
              aria-required="true"
              aria-invalid={!!fieldErrors.fullName}
              aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
              placeholder="John Doe"
            />
            {fieldErrors.fullName && (
              <p
                id="fullName-error"
                className="mt-2 text-sm text-red-700 font-medium flex items-center gap-1 animate-pulse"
                role="alert"
              >
                <X size={16} />
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-base font-semibold text-gray-800 mb-2"
            >
              Email Address
              <span className="text-red-600 ml-1" aria-label="required">
                *
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 outline-none placeholder-gray-400 ${
                fieldErrors.email
                  ? 'border-red-600 bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                  : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 hover:border-gray-400'
              }`}
              aria-required="true"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : 'email-hint'}
              placeholder="you@example.com"
            />
            {fieldErrors.email ? (
              <p
                id="email-error"
                className="mt-2 text-sm text-red-700 font-medium flex items-center gap-1 animate-pulse"
                role="alert"
              >
                <X size={16} />
                {fieldErrors.email}
              </p>
            ) : (
              <p id="email-hint" className="mt-1 text-sm text-gray-600">
                We'll never share your email with anyone else.
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="mb-8 border-0 p-0">
          <legend className="sr-only">Password Information - Create and confirm your password following the requirements below</legend>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-base font-semibold text-gray-800 mb-2"
            >
              Password
              <span className="text-red-600 ml-1" aria-label="required">
                *
              </span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg transition-all duration-200 outline-none placeholder-gray-400 ${
                  fieldErrors.password
                    ? 'border-red-600 bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 hover:border-gray-400'
                }`}
                aria-required="true"
                aria-invalid={!!fieldErrors.password}
                aria-describedby={`password-requirements ${fieldErrors.password ? 'password-error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1.5 transition-colors"
                aria-label={
                  showPassword
                    ? 'Hide password. Password is currently visible.'
                    : 'Show password. Password is currently hidden. Press to reveal.'
                }
                aria-pressed={showPassword}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                className="mt-2 text-sm text-red-700 font-medium flex items-center gap-1 animate-pulse"
                role="alert"
              >
                <X size={16} />
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-base font-semibold text-gray-800 mb-2"
            >
              Confirm Password
              <span className="text-red-600 ml-1" aria-label="required">
                *
              </span>
            </label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className={`w-full px-4 py-3 pr-12 border-2 rounded-lg transition-all duration-200 outline-none placeholder-gray-400 ${
                  fieldErrors.confirmPassword
                    ? 'border-red-600 bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                    : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 hover:border-gray-400'
                }`}
                aria-required="true"
                aria-invalid={!!fieldErrors.confirmPassword}
                aria-describedby={
                  fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setShowConfirmPassword(!showConfirmPassword);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1.5 transition-colors"
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password. Password is currently visible.'
                    : 'Show confirm password. Password is currently hidden. Press to reveal.'
                }
                aria-pressed={showConfirmPassword}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className="mt-2 text-sm text-red-700 font-medium flex items-center gap-1 animate-pulse"
                role="alert"
              >
                <X size={16} />
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </fieldset>

        <div
          className="mb-8 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200 shadow-sm"
          role="region"
          aria-live="polite"
          aria-atomic="false"
          aria-label="Password requirements checklist. Mark as you type. All items must be checked to create your account."
        >
          <h2 id="password-requirements" className="text-base font-bold text-gray-800 mb-1">
            Password Requirements
          </h2>
          <p className="sr-only">Your password must meet all of the following criteria:</p>
          <p className="text-xs text-gray-600 mb-4">All items must be met</p>
          <ul className="space-y-3" role="list" aria-label="Password requirement list">
            {passwordRequirements.map((requirement, index) => {
              const isMet = requirement.test(formData.password);
              return (
                <li
                  key={index}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded transition-all duration-200 ${
                    isMet ? 'bg-green-50' : 'bg-transparent'
                  }`}
                  role="listitem"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span
                    className={`flex-shrink-0 font-bold ${
                      isMet ? 'text-green-600' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  >
                    {isMet ? <Check size={20} /> : <X size={20} />}
                  </span>
                  <span
                    className={`font-medium ${
                      isMet ? 'text-green-700' : 'text-gray-600'
                    }`}
                    aria-label={`${requirement.label}, ${isMet ? 'met' : 'not met'}`}
                  >
                    {requirement.label}
                  </span>
                </li>
              );
            })}
          </ul>
          {allRequirementsMet && (
            <p className="mt-4 text-sm text-green-700 font-medium flex items-center gap-1" role="status">
              <Check size={18} />
              All requirements met
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-bold text-base transition-all duration-200 outline-none ${
            completionPercentage !== 100
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg'
          }`}
          disabled={completionPercentage !== 100}
          aria-label={
            completionPercentage !== 100
              ? `Create Account button. Disabled - form is ${Math.round(completionPercentage)}% complete, ${4 - Math.ceil((completionPercentage / 25))} field(s) remaining`
              : 'Create Account. Activate to submit your registration'
          }
        >
          Create Account
        </button>

        <p className="sr-only mt-4 text-sm text-gray-600">
          Use keyboard shortcut Tab to navigate between fields, Shift+Tab to go back, Enter or Space to activate buttons, and use arrow keys in the password visibility toggle.
        </p>
      </form>

      <p className="mt-8 text-center text-base text-gray-600">
        Already have an account?{' '}
        <a
          href="#"
          className="text-blue-600 hover:text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 transition-colors"
        >
          Sign in
        </a>
      </p>
        </div>
      </div>
    </div>
  );
}
