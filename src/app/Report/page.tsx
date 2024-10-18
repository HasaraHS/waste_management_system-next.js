'use client'
import React, { useState, useCallback, useEffect } from "react";
import {MapPin, Upload, CheckCircle, Loader} from 'lucide-react';
import {Button} from '@/components/ui/button';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {StandaloneSearchBox, useJsApiLoader} from '@react-google-maps/api';
import { Libraries } from "@react-google-maps/api";
import { useRouter } from "next/navigation";
import {toast} from 'react-hot-toast';
import { resolve } from "path";
import { rejects } from "assert";
import { readFile } from "fs";
import { createReport } from "../../../utils/database/action";

const geminiApiKey = process.env.GEMINI_API_KEY as any;
const googleMapsApikey = process.env.GOOGLE_MAPS_API_KEY as any;

const libraries : Libraries = ['places']

export default function ReportPage() {
    const [user, setUser] = useState ('') as any
    const router = useRouter();

    const [reports, setReports] = useState<Array< {
        id: number;
        location : string;
        wasteType : string;
        amount : string;
        createdAt : string;
    } >> ([])

    const [newReport , setNewReport] = useState({
        location: "",
        type : "",
        amount: "",
    });

    const [file, setFile] = useState <File | null > (null);
    const [preview, setPreview] = useState< string | null> (null);

    const [verificationStatus, setVerificationStatus] = useState <'idle'|'verifying'|'sucess'|'failure'>('idle');
    const [verificationResult, setVerificationResults] = useState <{
        wasteType:string;
        quantity:string;
        confidence: number;
    } | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [SearchBox, setSearchBox] = useState <google.maps.places.SearchBox | null>(null);

    const {isLoaded} = useJsApiLoader ({
        id : 'google-map-script',
        googleMapsApiKey : googleMapsApikey,
        libraries : libraries,
    });

    const onLoad = useCallback ((ref:google.maps.places.SearchBox) => {
        setSearchBox(ref)
    }, []);

    const onPlacedChange = () => {
        if(SearchBox){
            const places = SearchBox.getPlaces();
            if(places && places.length > 0 ) {
                const place = places [0];
                setNewReport(prev => ({
                    ...prev,
                    location : place.formatted_address || "",
                }));
            }
        }
    };

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
       const {name, value} = e.target
       setNewReport ({...newReport, [name] : value});   
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) =>  {
        if(e.target.files && e.target.files[0]){
            const selectedFile = e.target.files[0]
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?. result as string)
            }
            reader.readAsDataURL(selectedFile);
        }
    }; 

    const readFileAsBase64 = (file: File) : Promise <string> => {
        return new Promise ((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL (file)
        })
    }

    const handleVerify = async () => {
        if(!file) return;

        setVerificationStatus('verifying');
        try {
           const genAI = new GoogleGenerativeAI(geminiApiKey);
           const model = genAI.getGenerativeModel({model:'gemni-1.5-flash'})
           const base64Data = await readFileAsBase64 (file);
           const imageParts = [
            {
                inlineData : {
                    data: base64Data.split(',')[1],
                    mimeType : file.type    
                },
            },
           ];

           const prompt = `You are an expert in waste management and recycling. Analyse this image and provide:
           1. The type of waste (e.g., plastic, paper, glass, metal, organic)
           2. An estimate of the quantity pr amount (in kg or liters)
           3. Your confidence level in this assessment (as a precentage)

           Respond in JSON format like this: 
           {
                "wasteType" : "type of waste",
                "quantity" : "estimates quantity with unit",
                "confidence" : confidence level as a number between 0 and 1
           }`;

           const result = await model.generateContent([prompt, ...imageParts])
           const responce = await result.response;
           const text = responce.text();

           try {
            const parseResult = JSON.parse(text);
            if(parseResult.wasteType && parseResult.quantity && parseResult.confidence){
                setVerificationResults(parseResult)
                setVerificationStatus('sucess')
                setNewReport({
                    ...newReport,
                    type : parseResult.wasteType,
                    amount : parseResult.quantity
                });
            } else {
                console.error('Invalied verification results', parseResult);
                setVerificationStatus('failure');
            }
           } catch (e){
            console.error('Failed to parse JSON respones', e);
            setVerificationStatus('failure');
           }

        }catch (e) {
            console.error('Error verifying waste', e);
            setVerificationStatus('failure');
        }
    };

    const handleSubmit = async(e:React.FormEvent) => {
        e.preventDefault();
        if(verificationStatus !== 'sucess' || !user){
            toast.error('Please verify the waste before submitting or log in');
            return
        }

        setIsSubmitting(true);
        try{
            const report = await createReport(user.id, newReport.location
                ,newReport.type, newReport.amount, preview || undefined, 
                verificationResult ? JSON.stringify(verificationResult) : undefined
            ) as any;

            const formattedReport = {
                id: report.id,
                location : report.location,
                wasteType : report.wasteType,
                amount : report.amount,
                createdAt: report.createdAt.toISOString().split("T")[0],
            };

            setReports([formattedReport, ...reports])
            setNewReport({location: "" , type : "", amount : ""});
            setFile(null);
            setPreview(null);
            setVerificationStatus('idle');
            setVerificationResults(null);

            toast.success(`Report sumbitted successfully' you've earned points for reporting waste`);
        }catch(e) {
            console.error('Error submitting report', e);
            toast.error('Failed to submit report. Please try again');
        } finally{
            setIsSubmitting(false);
        }
    };

    //check user authentication and fetch reasent reports
    useEffect (() => {
        
    })
}