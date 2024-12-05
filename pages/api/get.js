export default async function handler(req, res) {
      try {
          const { url } = req.query;

              // Kiểm tra URL hợp lệ
                  if (!url || !url.startsWith("http")) {
                        return res.status(400).json({ error: "Invalid or missing URL" });
                            }

                                // Gửi request tới URL được cung cấp
                                    const response = await fetch(url);

                                        // Kiểm tra trạng thái của response
                                            if (!response.ok) {
                                                  return res.status(response.status).json({ error: `Failed to fetch: ${response.statusText}` });
                                                      }

                                                          // Lấy dữ liệu từ response
                                                              const data = await response.text();

                                                                  // Trả về dữ liệu
                                                                      res.status(200).send(data);
                                                                        } catch (error) {
                                                                            res.status(500).json({ error: "Internal Server Error", details: error.message });
                                                                              }
                                                                              }

