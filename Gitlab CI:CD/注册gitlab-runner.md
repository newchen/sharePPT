
## 注册gitlab-runner

```shell
docker run --rm -v /volume1/docker/gitlab/gitlab-runner:/etc/gitlab-runner gitlab/gitlab-runner register \
  --non-interactive \
  --executor "docker" \
  --docker-image alpine:latest \
  --url "http://chuanbin.f3322.net:8021/" \
  --registration-token "5z6nQijqxN4SCaZF4NiV" \
  --description "runner-2" \
  --tag-list "cicd2" \
  --run-untagged="true" \
  --locked="false" \
  --access-level="not_protected"
```