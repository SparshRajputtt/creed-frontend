//@ts-nocheck

import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Grid3X3,
  List,
  ArrowRight,
  Package,
  TrendingUp,
  Sparkles,
  Star,
} from 'lucide-react';
import { useCategories } from '@/queries/hooks/category';

export const Categories: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const { data: categories, isLoading } = useCategories();

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCategories = categories?.filter(
    (category) => category.isPopular
  );

  if (isLoading) {
    return (
      <section className="py-12 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="animate-pulse space-y-8 lg:space-y-12">
            {/* Header Skeleton */}
            <div className="text-center space-y-4">
              <div className="h-8 lg:h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-64 lg:w-80 mx-auto"></div>
              <div className="h-4 lg:h-6 bg-gray-200 rounded-full w-80 lg:w-96 mx-auto"></div>
            </div>

            {/* Search Bar Skeleton */}
            <div className="max-w-md mx-auto">
              <div className="h-12 lg:h-14 bg-white rounded-2xl shadow-lg"></div>
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl lg:rounded-3xl shadow-lg overflow-hidden"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300"></div>
                  <div className="p-4 lg:p-6 space-y-3">
                    <div className="h-5 lg:h-6 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-3 lg:h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 lg:h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-4 lg:px-6 py-2 mb-4 lg:mb-6">
            <Sparkles className="h-4 lg:h-5 w-4 lg:w-5 text-blue-600" />
            <span className="text-xs lg:text-sm font-semibold text-blue-700">
              Explore Categories
            </span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 lg:mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto px-4">
            Discover amazing products across all categories and find exactly
            what you're looking for
          </p>
        </motion.div>

        {/* Search and View Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 lg:mb-12"
        >
          <div className="max-w-md mx-auto mb-6 lg:mb-8 px-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 lg:h-5 w-4 lg:w-5" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 lg:pl-12 h-12 lg:h-14 text-base lg:text-lg border-0 bg-white shadow-lg rounded-2xl focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center px-4">
            <div className="bg-white rounded-2xl p-2 shadow-lg border">
              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-xl h-8 lg:h-10 text-sm ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Grid3X3 className="h-3 lg:h-4 w-3 lg:w-4 mr-1 lg:mr-2" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-xl h-8 lg:h-10 text-sm ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <List className="h-3 lg:h-4 w-3 lg:w-4 mr-1 lg:mr-2" />
                  List
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Popular Categories */}
        {popularCategories && popularCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12 lg:mb-16"
          >
            <div className="flex items-center gap-3 mb-6 lg:mb-8 px-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full px-3 lg:px-4 py-2">
                <TrendingUp className="h-4 lg:h-5 w-4 lg:w-5 text-amber-600" />
                <span className="font-semibold text-amber-700 text-sm lg:text-base">
                  Popular
                </span>
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                Trending Categories
              </h3>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-4">
              {popularCategories.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl lg:rounded-3xl h-full">
                    <a
                      href={`/categories/${category.slug}`}
                      className="block h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            category.image?.url ||
                            '/placeholder.svg?height=300&width=400&query=category'
                          }
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        <div className="absolute top-3 lg:top-4 left-3 lg:left-4">
                          <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg text-xs">
                            <Star className="h-2 lg:h-3 w-2 lg:w-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                            <ArrowRight className="h-3 lg:h-4 w-3 lg:w-4 text-white group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 lg:p-6 flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-base lg:text-lg line-clamp-1">
                          {category.name}
                        </h4>
                        <p className="text-gray-600 text-xs lg:text-sm line-clamp-2 mb-3 lg:mb-4 leading-relaxed">
                          {category.description?.slice(0, 50)}...
                        </p>
                        <div className="flex items-center justify-between">
                          {/* <span className="text-xs lg:text-sm font-semibold text-blue-600 bg-blue-50 px-2 lg:px-3 py-1 rounded-full">
                            {category.productCount || 0} products
                          </span> */}
                        </div>
                      </CardContent>
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6 lg:mb-8 px-4">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
              All Categories
            </h3>
            <div className="bg-gray-100 rounded-full px-3 lg:px-4 py-2">
              <span className="text-gray-700 font-medium text-sm lg:text-base">
                {filteredCategories?.length || 0} categories
              </span>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-4">
              {filteredCategories?.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl lg:rounded-3xl h-full">
                    <a
                      href={`/categories/${category.slug}`}
                      className="block h-full"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={
                            category.image?.url ||
                            '/placeholder.svg?height=300&width=400&query=category'
                          }
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"></div>
                        {category.isPopular && (
                          <div className="absolute top-3 lg:top-4 left-3 lg:left-4">
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-lg text-xs">
                              <Star className="h-2 lg:h-3 w-2 lg:w-3 mr-1" />
                              Popular
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-3 lg:h-4 w-3 lg:w-4 text-white group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4 lg:p-6 flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-base lg:text-lg line-clamp-1">
                          {category.name}
                        </h4>
                        <p className="text-gray-600 text-xs lg:text-sm line-clamp-2 mb-3 lg:mb-4 leading-relaxed">
                          {category.description.slice(0, 50)}...
                        </p>
                        <div className="flex items-center justify-between">
                          {/* <span className="text-xs lg:text-sm font-semibold text-gray-500 bg-gray-50 px-2 lg:px-3 py-1 rounded-full">
                            {category.productCount || 0} products
                          </span> */}
                        </div>
                      </CardContent>
                    </a>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4 px-4">
              {filteredCategories?.map((category, index) => (
                <motion.div
                  key={category._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ x: 5 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <a
                        href={`/categories/${category.slug}`}
                        className="flex items-center"
                      >
                        <div className="relative w-20 lg:w-24 h-20 lg:h-24 flex-shrink-0">
                          <img
                            src={
                              category.image?.url ||
                              '/placeholder.svg?height=96&width=96&query=category'
                            }
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
                        </div>
                        <div className="flex-1 p-4 lg:p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 lg:gap-3 mb-2">
                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors text-base lg:text-lg line-clamp-1">
                                  {category.name}
                                </h4>
                                {category.isPopular && (
                                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 text-xs">
                                    <Star className="h-2 lg:h-3 w-2 lg:w-3 mr-1" />
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs lg:text-sm line-clamp-2 mb-3 leading-relaxed">
                                {category.description.slice(0, 50)}...
                              </p>
                              {/* <span className="text-xs lg:text-sm font-semibold text-gray-500 bg-gray-50 px-2 lg:px-3 py-1 rounded-full">
                                {category.productCount || 0} products....
                              </span> */}
                            </div>
                            <div className="ml-3 lg:ml-4">
                              <div className="bg-blue-50 group-hover:bg-blue-100 rounded-full p-2 lg:p-3 transition-colors">
                                <ArrowRight className="h-4 lg:h-5 w-4 lg:w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Empty State */}
        {filteredCategories?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 lg:py-20 px-4"
          >
            <div className="w-24 lg:w-32 h-24 lg:h-32 mx-auto mb-4 lg:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Package className="h-12 lg:h-16 w-12 lg:w-16 text-gray-400" />
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 lg:mb-4">
              No categories found
            </h3>
            <p className="text-gray-600 mb-6 lg:mb-8 max-w-md mx-auto text-sm lg:text-base">
              We couldn't find any categories matching your search. Try
              adjusting your search terms.
            </p>
            <Button
              onClick={() => setSearchQuery('')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-full px-6 lg:px-8 py-2 lg:py-3 shadow-lg hover:shadow-xl transition-all"
            >
              Clear Search
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
