const API_BASE_URL: string = 'https://grecom.taobao.com/recommend?pageSize=20&language=vi&type=shop®ionId=VN&_input_charset=UTF-8&_output_charset=UTF-8&pageNo=';
const BATCH_SIZE: number = 50;
const APP_IDS: number[] = [42704, 42050];

// Định nghĩa interface cho dữ liệu sản phẩm
interface Product {
  itemId: string;
  skuId: string;
  name: string;
  imageUrl: string;
  price: number;
  currentPrice: number;
  discount: number;
  subsidy: number;
  totalStock: number;
  currentStock: number;
  soldCount: number;
  shopType: string;
}

// Định nghĩa interface cho dữ liệu từ API
interface ApiResponse {
  result: {
    endPage?: boolean;
    data: {
      items: any[];
    }
  }[];
}

// Định nghĩa interface cho request và response (cho serverless)
interface Request {
  method?: string;
}

interface Response {
  status: (code: number) => Response;
  json: (data: any) => void;
  send: (data: any) => void;
}

// Hàm lấy dữ liệu từ API
async function fetchPage(page: number, appId: number): Promise<ApiResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${page}&appid=${appId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error(`Lỗi khi lấy dữ liệu trang ${page} với appid=${appId}:`, error.message);
    return null;
  }
}

// Hàm ánh xạ dữ liệu
function mapProductData(items: any[]): Product[] {
  return items.map(item => ({
    itemId: item.itemId,
    skuId: item.skuId,
    name: item.itemTitle,
    imageUrl: item.itemImg,
    price: item.itemPrice.itemPrice,
    currentPrice: item.itemPrice.itemDiscountPrice,
    discount: item.itemPrice.itemDiscount || 0,
    subsidy: item.itemPrice.subsidy,
    totalStock: item.itemSaleVolume.itemTotalStock,
    currentStock: item.itemSaleVolume.itemCurrentStock,
    soldCount: item.itemSaleVolume.itemSoldCnt,
    shopType: item.buType[0] || 'Normal'
  }));
}

// Hàm loại bỏ trùng lặp
function removeDuplicates(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter(product => {
    const key = `${product.itemId}-${product.skuId}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Hàm lấy sản phẩm cho một appId
async function fetchProductsForAppId(appId: number): Promise<Product[]> {
  let products: Product[] = [];
  let page: number = 1;
  let isEnd: boolean = false;

  while (!isEnd) {
    const pagesToFetch: number[] = Array.from(
      { length: Math.min(BATCH_SIZE, 50) },
      (_, i) => page + i
    );

    const results: (ApiResponse | null)[] = await Promise.all(
      pagesToFetch.map(p => fetchPage(p, appId))
    );

    let hasValidData: boolean = false;
    for (const data of results) {
      if (!data || !data.result || !data.result[0]?.data?.items) continue;

      const items = data.result[0].data.items;
      const mappedProducts = mapProductData(items);
      products.push(...mappedProducts);
      hasValidData = true;

      if (data.result[0].endPage === true && data.result[0].data.items.length === 0) {
        isEnd = true;
        break;
      }
    }

    if (!hasValidData && results.every(r => r === null || (r?.result && r.result[0]?.endPage === true))) {
      isEnd = true;
    }

    page += BATCH_SIZE;

    if (results.every(r => r === null || (r && r.result && r.result[0]?.endPage === true && r.result[0].data.items.length === 0))) {
      isEnd = true;
    }
  }

  console.log(`Hoàn tất lấy ${products.length} sản phẩm từ appid=${appId}`);
  return products;
}

// Hàm lấy tất cả sản phẩm
async function fetchAllProducts(): Promise<Product[]> {
  let allProducts: Product[] = [];

  const productPromises: Promise<Product[]>[] = APP_IDS.map(appId => fetchProductsForAppId(appId));
  const productsByAppId: Product[][] = await Promise.all(productPromises);

  allProducts = productsByAppId.flat();
  allProducts = removeDuplicates(allProducts);

  console.log('Hoàn tất lấy dữ liệu từ tất cả API.');
  return allProducts;
}

// Export handler cho serverless function
export default async function handler(req: Request, res: Response) {
  try {
    const products = await fetchAllProducts();
    res.status(200).json(products);
  } catch (error: any) {
    console.error('Lỗi trong handler:', error.message);
    res.status(500).send(`Lỗi: ${error.message}`);
  }
}
