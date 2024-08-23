import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
// import { Auth } from 'firebase/auth';
// import { useEffect } from 'react';
// import { auth } from 'firebase-admin';

export default function App({ Component, pageProps }) {
  // const router = useRouter();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       // User is signed in
  //       const userId = user.uid;
  //       console.log("xdcfgvh",userId)
  //       // Check if the user is an admin
  //       // You may need to adjust this based on your Firestore structure
  //       // For simplicity, assuming the isAdmin field is a boolean
  //       if (user.isAdmin) {
  //         router.push('/Admindashboard'); // Redirect to admin dashboard
  //       }
  //     } else {
  //       // User is signed out
  //       router.push('/signin'); // Redirect to the login page
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mt-[67px]">
      <Component {...pageProps} />

      </div>
      <Footer />
    </div>
  );
}
