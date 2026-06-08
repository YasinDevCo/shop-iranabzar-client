// utilities/api-address-util.ts
export class ApiAddress {
  static baseAddress: string = "https://shop-iranabzar-api.onrender.com/api";

  // Auth
  static login: string = "/auth/login";
  static register: string = "/auth/register";
  static profile: string = "/auth/profile";

  // Contact
  static contact: string = "/contact";
  static contactStats: string = "/contact/stats";
  static contactUpdateStatus: string = "/contact/:id/status";
  static getMessageById: string = "/contact/:id";
  static deleteMessage: string = "/contact/:id";


  // User
  static getOneUserById: string = "/user/getOne/:id";
  static getAllUsers: string = "/user/getAll";
  static deleteUser: string = "/user/delete/:id";
  static updateUser: string = "/user/update/:id";
  static addUser: string = "/user/add";

  // Product
  static getAllProducts: string = "/product";
  static getProductById: string = "/product/:id";
  static getProductsByCategory: string = "/product/category/:categoryId";
  static createProduct: string = "/product";
  static updateProduct: string = "/product/:id";
  static deleteProduct: string = "/product/:id";
  static filterProducts: string = "/product/filter";

  // Orders
  static getMyOrders: string = "/orders/my-orders";
  static getOrderById: string = "/orders/:id";
  static createOrder: string = "/orders/create";
  static cancelOrder: string = "/orders/:id/cancel";

  // Address
  static getAddresses: string = "/addresses";
  static createAddress: string = "/addresses";
  static updateAddress: string = "/addresses/:id";
  static deleteAddress: string = "/addresses/:id";
  static setDefaultAddress: string = "/addresses/:id/default";

  // Blog
  static getAllBlogs: string = "/blogs";
  static getBlogBySlug: string = "/blogs/:slug";
  static getAllBlogsAdmin: string = "/blogs/admin/all";
  static getBlogById: string = "/blogs/admin/:id";
  static blogStats: string = "/blogs/admin/stats";
  static createBlog: string = "/blogs/admin";
  static updateBlog: string = "/blogs/admin/:id";
  static deleteBlog: string = "/blogs/admin/:id";
  static updateBlogStatus: string = "/blogs/admin/:id/status";

  // Category
  static getAllCategories: string = "/category";
  static createCategory: string = "/category";
  static updateCategory: string = "/category/:id";
  static deleteCategory: string = "/category/:id";

  // Dashboard
  static dashboardAdminStats: string = "/dashboard/admin/stats";
  static dashboardUserStats: string = "/dashboard/user/stats";
  static dashboardWidgets: string = "/dashboard/widgets";

  // Payment
  static createPayment: string = "/payment/create";
  static verifyPayment: string = "/payment/verify/:id";
  static cancelPayment: string = "/payment/cancel/:id";
  static getMyPayments: string = "/payment/my-payments";
  static getAllPayments: string = "/payment/admin/all";
  static getPaymentById: string = "/payment/:id";
  static deletePayment: string = "/payment/admin/:id";

  // Reviews
  static getProductReviews: string = "/reviews/product/:productId";
  static createReview: string = "/reviews";
  static getMyReviews: string = "/reviews/my-reviews";
  static getReviewStats: string = "/reviews/my-stats";
  static updateReview: string = "/reviews/:id";
  static deleteReview: string = "/reviews/:id";

  // Wishlist
  static getWishlist: string = "/wishlist";
  static addToWishlist: string = "/wishlist/add/:productId";
  static removeFromWishlist: string = "/wishlist/remove/:productId";
  static clearWishlist: string = "/wishlist/clear";
}
