import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const VerifyEmailPage: React.FC = () => {
    const { username, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await axios.get(`http://localhost:8080/api/verify-email/${username}/${token}`);
                toast.success("Email verified successfully!");
                navigate("/login");
            } catch (error) {
                toast.error("Verification failed. Try again or contact support.");
                console.error("Verification error:", error);
            }
        };

        verifyEmail();
    }, [username, token, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Verifying...</h1>
                <p className="mt-2 text-gray-600">Please wait while we verify your email.</p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
