import ProductDetailClient from '@/components/product/ProductDetail';

interface ProductPageProps {
  params: { id: string } | Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id: productId } = await params;

  return (
    <ProductDetailClient params={{ id: productId }} />
  );
}
