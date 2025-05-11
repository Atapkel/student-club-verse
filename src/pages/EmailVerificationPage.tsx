import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const EmailVerificationPage = () => {
    const [secondsLeft, setSecondsLeft] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval); // Остановить таймер
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Закрытие окна через 10 секунд
        const timer = setTimeout(() => {
            if (window.opener) {
                window.close();  // Закрыть окно, если оно было открыто через window.open()
            }
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="mt-2 text-gray-600">
                    We’ve sent a verification link to your email. Please click the link to verify your account.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    This page will close automatically in <span
                    className="font-semibold">{secondsLeft}</span> second{secondsLeft !== 1 && "s"}.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    You can also manually close this page.
                </p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => window.close()}
                >
                    Close this page
                </button>
            </div>
        </div>
    );
};

export default EmailVerificationPage;
