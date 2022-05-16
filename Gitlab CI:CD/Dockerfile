# 基础镜像
FROM nginx:latest

# 将 docs-dist 文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY docs-dist/ /usr/share/nginx/html

# 对外端口
EXPOSE 80

# 运行nginx
CMD ["nginx","-g","daemon off;"]
