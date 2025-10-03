"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { hasEmptyField, updateField } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const loginCredentialInit = {
    email: '',
    password: '',
}

export function AuthPage() {
    const [credentials, setCredentials] = useState(loginCredentialInit);

    async function handleSubmit() {
        try {
        } catch (error) { toast.error(`${error}`) }
    }
    return (
        <section className="flex-center flex-col h-screen">
            <img
                src="/images/cvsu_entrance.jpg"
                alt="Background"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t 
                from-transparent from-[0%] 
                via-white/90 via-[50%] 
                to-white to-[99%]">
            </div>
            <div className="z-10 flex-center flex-col gap-2">
                <Image
                    src='/images/cvsu_logo.png'
                    alt="CvSU Logo"
                    width={120}
                    height={120}
                />
                <div className="head w-100 text-green-800 scale-x-110 font-bold text-5xl text-center">
                    CAVITE STATE <br />UNIVERSITY
                </div>

                <form 
                    className="w-100 mt-4 flex flex-col bg-white px-12 py-6 rounded-md gap-4 shadow-md shadow-[#d3d3d3]"
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div>
                        <div className="text-darkgreen">Email Address</div>
                        <Input
                            onChange={ e => updateField(setCredentials, 'email', e.target.value) }
                        />
                    </div>
                    <div>
                        <div className="text-darkgreen">Password</div>
                        <Input
                            type="password"
                            onChange={ e => updateField(setCredentials, 'password', e.target.value) }
                        />
                    </div>  
                    <Button 
                        type="submit"
                        disabled={hasEmptyField(credentials)}
                        className="!bg-darkgreen font-bold text-white"
                    >
                        LOGIN
                    </Button>
                    <Link
                        href=""
                        className="text-[#002803] text-center"
                    >
                        Forgot Password?
                    </Link>
                </form>
            </div>
        </section>
    )
}