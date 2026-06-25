'use client';

export default function ProductCategories({ locale }: { locale: string }) {
  return (
    <section className="py-16 bg-parchment">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif font-medium text-foreground mb-8">
          Product Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-200 aspect-[4/3] rounded-lg"></div>
          <div className="bg-gray-200 aspect-[4/3] rounded-lg"></div>
          <div className="bg-gray-200 aspect-[4/3] rounded-lg"></div>
          <div className="bg-gray-200 aspect-[4/3] rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}