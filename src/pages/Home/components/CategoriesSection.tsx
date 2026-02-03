//@ts-nocheck
import type React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Utensils, Coffee, Package, ArrowRight } from 'lucide-react';
import { useCategories } from '@/queries/hooks/category/useCategories';

export const CategoriesSection: React.FC = () => {
  const { data: categories, isLoading } = useCategories({ featured: true });

  const categoryIcons = {
    'Water Bottles': Droplets,
    'Lunch Boxes': Utensils,
    'Coffee Mugs': Coffee,
    default: Package,
  };

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base">
              Explore our carefully curated categories of premium products
              designed for your lifestyle
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] lg:aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">
                    <div className="h-3 lg:h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-2 lg:h-3 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm lg:text-base">
            Explore our carefully curated categories of premium products
            designed for your lifestyle
          </p>
        </div>

        {categories && (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
            {categories.slice(0, 8).map((category) => {
              const IconComponent =
                categoryIcons[category.name as keyof typeof categoryIcons] ||
                categoryIcons.default;

              return (
                <Link
                  key={category._id}
                  to={`/categories/${category.slug}`}
                  className="group block"
                >
                  <Card className="h-full group-hover:shadow-lg lg:group-hover:shadow-xl transition-all duration-300 border group-hover:border-primary/20 overflow-hidden">
                    <CardContent className="p-0 h-full flex flex-col">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] lg:aspect-square bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden">
                        {category.image?.url ? (
                          <img
                            src={category.image.url}
                            alt={category.image.alt || category.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <IconComponent className="w-8 h-8 lg:w-12 lg:h-12 text-primary/40" />
                          </div>
                        )}

                        {/* Product Count Badge */}
                        {category.productCount > 0 && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2 text-xs px-2 py-1 bg-white/90 backdrop-blur-sm"
                          >
                            {category.productCount}
                          </Badge>
                        )}

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm lg:text-base mb-1 lg:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {category.name}
                          </h3>

                          {/* Description - Hidden on mobile, shown on larger screens */}
                          <p className="hidden lg:block text-muted-foreground text-xs lg:text-sm mb-3 line-clamp-2">
                            {category.description.slice(0, 50) ||
                              `Discover our premium ${category.name.toLowerCase()} collection`}
                          </p>
                        </div>

                        {/* Call to Action - More subtle on mobile */}
                        <div className="flex items-center justify-between lg:justify-center">
                          <span className="text-xs lg:text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
                            Explore
                          </span>
                          <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
