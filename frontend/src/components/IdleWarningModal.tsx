import { useState, useEffect } from 'react';

interface IdleWarningModalProps {
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

/**
 * IdleWarningModal
 *
 * Displays a centered modal warning the user they have been idle, showing a 30-second countdown.
 * Automatically calls onLogout when the timer reaches 0. Provides buttons to stay logged in or log out immediately.
 *
 * @param onStayLoggedIn - Callback invoked when the user chooses to remain logged in.
 * @param onLogout - Callback invoked when the user logs out manually or when the countdown expires.
 * @returns JSX.Element - The idle warning modal element.
 */
export const IdleWarningModal = ({ onStayLoggedIn, onLogout }: IdleWarningModalProps) => {
  const [secondsLeft, setSecondsLeft] = useState(60);

  // Reset countdown whenever the modal opens
  useEffect(() => {
    setSecondsLeft(30);
  }, []);

  // Handle the 1-minute countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      onLogout(); // Log out automatically when time hits 0
    }

    return () => clearInterval(timer);
  }, [secondsLeft, onLogout]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-xl dark:bg-gray-900 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Are you still there?
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            You have been idle for a while. For your security, you will be logged out in:
          </p>
          
          <div className="my-6 font-mono text-5xl font-bold text-blue-600 dark:text-blue-400">
            00:{secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onStayLoggedIn}
              className="w-full py-3 font-semibold text-white transition-colors bg-blue-500 rounded-md shadow-lg hover:bg-blue-600 shadow-blue-500/30"
            >
              Stay Logged In
            </button>
            <button
              onClick={onLogout}
              className="w-full py-2 text-sm text-gray-500 transition-colors hover:text-red-500 dark:text-gray-400"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};