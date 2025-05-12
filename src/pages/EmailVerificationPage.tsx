import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const EmailVerificationPage = () => {
    const [secondsLeft, setSecondsLeft] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => prev > 0 ? prev - 1 : 0);
        }, 1000);

        const timer = setTimeout(() => {
            navigate("/");
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center max-w-md">
                <h1 className="text-2xl font-bold">Verify your email</h1>
                <p className="mt-2 text-gray-600">
                    We’ve sent a verification link to your email. Please click the link to verify your account.
                </p>
                <p className="mt-4 text-sm text-gray-500">
                    You will be redirected to the home page in {" "}
                    <span className="font-semibold">{secondsLeft}</span> second{secondsLeft !== 1 && "s"}.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 text-blue-600 hover:underline"
                >
                    Go to Home Page Now
                </button>
            </div>
        </div>
    );
};

export default EmailVerificationPage;