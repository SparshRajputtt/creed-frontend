//@ts-nocheck
import type React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star } from "lucide-react";
import HeroImage from "@/images/Bottle-Hand.png";
import Bottle_Video from "@/images/Bottle_Video.mp4";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                New Collection Available
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Premium
                <span className="text-gradient block">Water Bottles</span>&
                Lunch Boxes
              </h1>
              <p className="text-lg text-muted-foreground max-w-md">
                Discover our eco-friendly collection of premium water bottles,
                lunch boxes, and lifestyle products designed for the modern
                world.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="h-12 px-8" asChild>
                <Link to="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 bg-transparent"
                asChild
              >
                <Link to="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold text-primary">4.9</span>
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
          <img
            src={HeroImage}
            alt="Premium Water Bottles"
            className=" w-[110%]"
          />
          {/* <div className="h-[700px] mr-[0px]">
            <video
              src={Bottle_Video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div> */}

          {/* <div className="relative">
            <div className="relative z-10 animate-float">
              <img
                src={HeroImage}
                alt="Premium Water Bottles"
                className="scale-x-[-1]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-3xl"></div>
          </div> */}
        </div>
      </div>
    </section>
  );
};
