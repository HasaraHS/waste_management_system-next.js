import { ArrowRight, Leaf, Recycle, Users, MapPin, ChevronRight, Trees, HandCoins, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

//animation
function AnimatedGlobe() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-green-500 opacity-20 animate-pulse"></div>
      <div className="absolute inset-2 rounded-full bg-green-400 opacity-40 animate-ping"></div>
      <div className="absolute inset-4 rounded-full bg-green-300 opacity-60 animate-spin"></div>
      <div className="absolute inset-6 rounded-full bg-green-200 opacity-80 animate-bounce"></div>
      <Leaf className="absolute inset-0 m-auto h-16 w-16 text-green-600 animate-pulse"/>
    </div>
  )
}

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <section className="text-center mb-20 pl-16 ml-32">
        <AnimatedGlobe />
        <h1 className=" font-bold mb-6 text-gray-800 tracking-tight">
          <span className="text-green-700 text-5xl">Green City Concept</span>
          <br></br>
          <span
            className="text-gray-700 text-2xl"
            style={{ wordSpacing: "1rem" }}
          >
            {" "}
            Waste Management System
          </span>
        </h1>
        <p className="text-xl font-semibold text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
          join our community in making waste management more efficient and
          rewarding
        </p>
        <p
          className="text-gary-500 max-w-3xl mx-auto leading-relaxed mb-8"
          style={{ textAlign: "justify" }}
        >
          Together, we can create a cleaner, greener environment while earning
          exciting rewards. By participating in waste collection and reporting,
          you help reduce pollution, conserve resources, and inspire others to
          adopt sustainable practices. Whether it's by tracking your waste,
          collecting recyclables, or climbing the leaderboard, every effort
          counts. Connect with like-minded individuals, share tips, and make an
          impact on both your community and the planet. Let's turn waste into
          opportunity, one step at a time!
        </p>
        <Button className="bg-green-700 hover:bg-green-500 text-white text-lg px-10 rounded-full">
          Waste Report
        </Button>
      </section>

      <section className="grid md:grid-cols-2 gap-20 mb-20 ml-64" >
        <FeatureCard
          icon={Trees}
          title="Eco-Friendly"
          description="Our mission is to create a cleaner environment by embracing green practices and minimizing environmental impact."
        />

        <FeatureCard
          icon={HandCoins}
          title="Earn Rewards"
          description="Get rewarded for your eco-friendly actions. Collect points for recycling and reducing waste, and redeem them for exciting benefits."
        />

        <FeatureCard
          icon={Users}
          title="Community-Driven"
          description="Join a vibrant community dedicated to sustainable practices. Collaborate, share ideas, and participate in local initiatives to make a positive impact together."
        />

        <div className="flex justify-center">
          <FeatureCard
            icon={HeartHandshake}
            title="Support Local Initiatives"
            description="Empower local businesses and projects that prioritize sustainability. Your participation helps strengthen community ties and promotes environmentally friendly practices."
          />
        </div>
      </section>

      <section className="bg-gray-100 p-10 rounded-3xl shadow-lg mb-10 ml-64">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Contribution</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <ImpactCard title = "collected waste" value={"1 ton"} icon={Recycle} />
          <ImpactCard title = "Submitted Reports" value={30} icon={MapPin} />
          <ImpactCard title = "Tokens Earned" value={250} icon={HandCoins} />
          <ImpactCard title = "CO2 Offset" value={"300 kg"} icon={Trees} />
        </div>
      </section>
    </div>
  );
}

//create function to card
function FeatureCard({icon:Icon, title, description}:{icon: React.ElementType; title: string; description: string }){
 return (
  <div className="bg-gray-200 p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex flex-col items-center text-center">
    <div className="bg-green-100 p-4 rounded-full m-6">
      <Icon className="h-10 w-10 text-green-700"/>
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
    <p className="text-gray-600 leading-relaxed" style={{ textAlign: "justify" }}>{description}</p>
  </div>
 )
}

//create function to contibution cards
function ImpactCard ({title,value, icon:Icon}: {title:string; value:string | number;icon: React.ElementType}) {
return (
  <div className="p-6 rounded-xl bg-gray-200 border border-gray-100 transition-all
  duration -300 ease-in-out hover:shadow-md" >
    <Icon className="h-10 w-10 text-green-500 mb-4"></Icon>
    <p className="text-3xl font-bold mb-2 text-gray-800">{value}</p>
    <p className="text-sm text-gray-600">{title}</p> {" "}
  </div>
)
}