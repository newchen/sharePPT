### gitlab-ci.yml常见关键词解析
---

### stages(全局)

stage 是阶段的意思，用于归档job，按照定义的stage顺序来执行。
默认的stages和执行顺序为: .pre, build, test, deploy, .post，

> ps: .pre 和 .post比较特殊

job执行的顺序不是按照编写的顺序，大体上是按照stages中定义的顺序, 注意是大体，也有例外的情况。

**例1:**
未定义stages, 而且job中未使用stage关键词, 使用默认的 `test`  stage

```
job1: # 没有使用stage关键词, 默认'test'阶段
  script: echo 'job1'

job2:
  stage: build # 使用默认的stages的build阶段
  script: echo 'job2'
```

**例2:**
定义了stages, 会按照定义的顺序执行.
> 注意, 此时默认的stages: build，test，deploy就没有了, 只有你定义的stages: install, build, deploy, clean(.pre和.post仍有)

```
stages:
  - install
  - build
  - deploy
  - clean

job1:
  stage: install
  tags:
    - test
  script: echo 'install'

job2:
  stage: build
  tags:
    - test
  script: echo 'build1'

job3:
  stage: build # 每个阶段里面都可以定义多个job
  tags:
    - test
  script: echo 'build2'

job4:
  stage: deploy
  tags:
    - test
  script: echo 'deploy'
```

build阶段的所有任务(job2, job3) 执行完了之后, 才会执行deploy阶段的任务(job4)
> 你可能会发现job2和job3是串行的, 因为它们在同一个runner运行, 所以需要修改runner每次运行的作业数量, 默认是1, 这里改为10。修改`gitlab-runner/config.toml`文件`concurrent = 10`, 这样就会并行运行了。

---
### script(job)
任务要执行的shell脚本内容, 会被runner执行，在这里，你不需要使用git clone ....克隆当前的项目，再进行操作，因为在流水线中，每一个的job的执行都会将项目下载, 而且脚本的工作目录就是当前项目的根目录，所以可以就像在本地开发一样。此外script可以是单行或者多行。

单行脚本
```
job:
  script: npm install
```

多行脚本(每行前面多了个 '-')
```
job:
  script:
    - npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
    - npm install --registry=http://registry.npm.taobao.org
```
***script***是一个job的必填内容，不可或缺(特殊情况除外)。

---
### before_script(全局和job)

比较简单, 就不做过多介绍了

---
### after_script(全局和job)

比较简单, 就不做过多介绍了

---

### only/except(job)
> 这2个已经不推荐使用了, 推荐使用rules

only和except: 用分支策略来限制jobs构建：
+ only定义哪些分支和标签的git项目将会被job执行。
+ except定义哪些分支和标签的git项目将不会被job执行。

下面是策略规则：
+ only和except可同时使用。如果only和except在一个job配置中同时存在，则以only为准，跳过except(从下面示例中得出)。
+ only和except可以使用正则表达式。
+ only和except允许使用特殊的关键字：branches , tags , api , external , pipelines , pushes , triggers , web ,  merge_requests等

如果一个任务没有only属性，那默认就是only: ['branches', 'tags'] 操作分支或者tags都会触发流水线。
当前任务只有在master分支可以运行:
```
job:
  only:
    - master
```
只会运行以issue-开始的refs(分支)，而except中设置的将被跳过:
```
job:
  only:
    - /^issue-.*$/    # use regexp
  except:
    - branches  # use special keyword
```

**only 和 except 高级用法**
only 和 except 支持高级策略: refs , variables , changes , kubernetes 四个关键字可以使用
具体可参考: https://blog.csdn.net/mtsunbw/article/details/109624910

---
### when(job)
when关键字是满足某些条件之后要执行的job。比如你要实现在发生故障时仍能运行的作业, 在任务失败后需要触发一个job，或者你需要手动执行任务，或者当你一个任务执行成功后执行另一个任务.
  + on_success 当前面所有任务执行成功才执行, 默认值
  + on_failure 当前面阶段出现失败时执行
  + always 无论前面任务状态如何都执行
  + manual 手动执行任务
> ps: 假设有 job1-> job2 -> job3 这3个任务:
> 1. 只有job1设置了手动, 那么会跳过job1, 自动从job2开始执行;
> 2. 只有job2设置了手动, 那么会跳过job2, 执行: job1 -> job3

  + delayed 延迟执行任务, 需要start_in配合使用

---
### cache(全局和job)
缓存是将当前工作环境目录中的一些文件，一些文件夹存储起来，用于在各个任务初始化的时候恢复。避免多次下载同样的包，能够大大优化流水线效率。在前端项目中，我们经常把node_modules缓存起来，这样一条流水线都可以使用这些下载好的包。
cache下的参数主要有:

+ paths 当前工作环境下的目录
+ key 存储的key, 防止出现缓存覆盖的问题, 解释看下面
  - files：文件发生变化自动重新生成缓存(files最多指定两个文件)，提交的时候检查指定的文件。
+ untracked 是否缓存git忽略的文件
+ when 定义何时存储缓存: on_success；on_failure；always
+ policy 缓存策略, 默认(pull-push策略)：在每个job执行开始前下载文件，并在结束前重新上传文件, 不管文件是否有变化.
  - pull 跳过上传步骤, 假设: 某个 job 只是使用的其他 job 改变的文件, 自身不改变对应文件, 那么就不需要上传.
  - push 跳过下载步骤, 假设: 某个 job 不依赖于其他 job 改变的文件，自身改变的文件被其他 job 所依赖，那么就不需要下载
```
cache:
  key: hello-vue-cache
  paths:
    - node_modules
```

```
cache:
  key:
    files:
      - package-lock.json # 只要package-lock.json不变, node_modules就一直缓存
  paths:
    - node_modules
```
```
job:
  cache: {} # cache 禁用
```
**key的作用:**
使用 cache:key 关键字为每个缓存提供唯一的标识键。 使用相同缓存键的所有 job 都使用相同的缓存，包括在(同一项目)不同的 pipelines 中。

> key未设置时默认为default, 所有没定义 key 的 cache 使用的是同一份 cache，会随着 job 的执行一直被覆盖。


---
### artifacts(全局和job)
> 我们一般打tags的时候会用到, 方便回滚

保留文档。在每次 job 之前runner会清除未被 git 跟踪的文件。为了让编译或其他操作后的产物可以留存到后续使用，添加该参数并设置保留的目录，保留时间等。被保留的文件将被上传到gitlab以备后续使用。
比如我们构建一个前端项目后将dist目录保留:
```
...
job_build:
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

在安卓，ios打包的时候，也非常有用，因为流水线最终输出的就是一个可下载，可安装的应用。
主要有以下几个属性:
  + paths: 文件路径
  + exclude: 排除的文件
  + name: 文档名称, 默认artifacts
  + expose_as: 可用于在MR页面显示保留的文档
  + untracked: 布尔类型，是否将git忽略的文件加到文档中
  + when:   on_success；on_failure；always 何时上传文档
  + expire_in: 过期时间默认30天
  + reports: 收集测试报告, 比如: junit(单侧), conbertura(覆盖率)报告

**说明:**

- 默认情况下，后期的 jobs 会自动下载早期 job 创建的所有 artifacts
- 可以通过 dependencies 关键字定义当前 job 下载前面 stages 的哪些 job 的 artifacts
- 如果 job 中有 needs 关键字，那么只会下载 needs 关键字指定的 job 的 artifacts
- 未设定过期时间的情况下，30 天后会过期

**和cache关键字的区别:**

- cache 用来缓存依赖包，缓存的内容存在 gitlab-runner 中
- artifacts 用来传递不同 stage 构建的中间结果，缓存的内容将保存在 GitLab 上且可以进行下载


---
### tags(job)
关键词是用于指定Runner, tags的取值范围是在该项目可见的runner tags中，可以在Setting =>CI/CD => Runner 中查看。不设置则默认使用公有Runner去执行流水线。每个job可以指定多个标签，但只会选择其中一个运行。
> 为什么要有这个呢?
> 因为gitlab和gitlab-runner是分开部署的, 而且gitlab-runner可以部署多个, 部署到不同的服务器上, job中指定tag就可以使用指定的runner去执行这个job
```
install:
  tags:
    - hello-vue
    - docker
  script:
    - npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
    - npm install --registry=http://registry.npm.taobao.org
```

---

### needs(job)
> 注意, 要设置config.toml文件concurrent大于1

可无序执行作业，无需按照阶段顺序运行某些作业，可以让多个阶段同时运行。
```
stages:
  - stage-1
  - stage-2

job-1:
  stage: stage-1
  script:
    - echo "job-1 started"
    - sleep 5
    - echo "job-1 done"

job-2:
  stage: stage-1
  script:
    - echo "job-2 started"
    - sleep 20
    - echo "job-2 done"

job-3:
  stage: stage-2
  needs: [job-1]
  script:
    - echo "job-3 started"
    - sleep 5
    - echo "job-3 done"

job-4:
  stage: stage-2
  needs: [job-2]
  script:
    - echo "job-4 started"
    - sleep 5
```
这里job1 和 job2 是可以并行的。
job1之后将会启动job3 (立即执行, 不会等待job2完成作业)
job2之后将会启动job4 (立即执行, 不会等待job1完成作业)

---
### rules(job)
rules是用于规定任务的执行规则，使用一个表达式: 来规范哪些任务执行,  哪些任务不执行。还可以在任务成功或者失败后，触发另一个任务。
如下面这个例子
```
docker build:
  script: docker build -t my-image:$CI_COMMIT_REF_SLUG .
  rules:
    - if: '$CI_COMMIT_BRANCH == "master"'
      when: delayed
      start_in: '3 hours'
      allow_failure: true
```
如果当前的分支是master分支则任务执行就延迟3个小时，并且允许失败。
rules的下面的可选属性
+ if 使用if表达式 添加或移除一个任务， 类似 only:variables.
+ changes 根据某些个文件是否改变来追加或移除一些任务。类似 only:changes.
+ exists 根据是否存在特定文件来追加或移除一些任务

if中可以使用CICD的所有预设变量，分支，来源，合并请求，commit，push web，schedule等。可以针对不用的情景配置不用的规则。
```
job:
  script: echo "Hello, Rules!"
  rules:
    - if: '$CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "master"'
      when: manual
      allow_failure: true
```
解释起来并不复杂，一个判断语句，二个赋值语句。即如果当前分支是master，则任务的执行方式改为手动，并且运行失败。
再来看一个:
```
deploy:
  stage: deploy
  script: echo 'deploy'
  rules:
    - if: '$DOMAIN == "aaa.com"'
      when: manual
    - if: '$DOMAIN == "bbb.com"'
      when:delayed
      start_in: '5'
    - when: on_failure
```
上面的意思是: 如果变量DOMAIN的值是"aaa.com"就手动执行, 是"bbb.com"就延迟5秒执行, 否则前面有失败的才执行.

---

### extends(job)
这个关键词可以使一个任务继承另一个任务。如下案例:
```
.tests:
  script: rake test
  stage: test
  only:
    refs:
      - branches

rspec:
  extends: .tests
  script: rake rspec
  only:
    variables:
      - $RSPEC
```
任务rspec 继承了.tests任务，在流水线中.tests是一个隐藏的任务，在流水线中，以英文点开头的任务名，都是隐藏的任务,不会被执行。 被rspec继承后，相同的key会以rspec为准，rspec没有的，而.tests有的，则合并到rspec中，
合并后的结果是
```
rspec:
  script: rake rspec
  stage: test
  only:
    refs:
      - branches
    variables:
      - $RSPEC
```
使用这一个手段，可以写一个模板，只要稍微改改就能后使用。非常适合大批量编写流水线。

---
### trigger(job)
trigger 是应对那些更加复杂的CICD流程，如多流水线，父子流水线
使用它可以定义一个下游的流水线，配置了trigger的任务是不能跑脚本的，就是说不能定义script, before_script和 after_script.
这个是一个多项目流水线:

```
rspec:
  stage: test
  script: bundle exec rspec

staging:
  stage: deploy
  trigger: my/deployment
# trigger:
  # project: my/deployment
  # branch: stable # 可以指向具体的分支
```

流水线执行完test任务后就会去执行my/deployment项目的流水线

---
### include(全局)
使用include可以导入一个或多个额外的yaml文件到你的CICD配置里，这一你就可以将一个很长的流水线，分隔出来。使用include来引入。也可以将几个流水线中相同的配置，提取出来，公用。引入的文件扩展名必须是.yaml或者.yml两种，其他的不行。
include 关键词下，有四个可选性:
+ local, 引入一个当前项目的文件
+ file, 引入一个不同项目的文件
+ remote, 引入一个公网文件，
+ template, 引入一个由GitLab提供的模板

下面是几个例子
```
include:
  - local: '/templates/.gitlab-ci-template.yml'
```
```
include:
  - project: 'my-group/my-project'
    file: '/templates/.gitlab-ci-template.yml'
```
```
include:
  - remote: 'https://gitlab.com/awesome-project/raw/master/.gitlab-ci-template.yml'
```

---
### interruptible(job)
假设: 一个分支3个人在一分钟内都合并了一次，那么就会触发三次流水线，虽然没有问题，但我们有时想要一个自动取消多余流水线的功能。即: 如果当前有pengding或者running的流水线，此时又有新的流水线被触发，那么我们期望能够自动取消旧的流水线，一是保证资源的合理利用，二是保证不会出现部署旧的流水线的内容。

需要在`项目 --> 右侧菜单Settings --> CI/CD --> General pipelines展开 --> 勾选Auto-cancel redundant pipelines`设置后, 再结合interruptible 关键词, 定义到一个具体的job上，表明该任务是否能够被新的流水线打断，取消。默认为false， 即不可取消，不可被打断。
```
stages:
  - stage1
  - stage2

step-1:
  stage: stage1
  script:
    - echo "Can be canceled."
  interruptible: true

step-2:
  stage: stage2
  script:
    - echo "Can not be canceled."
```
当step-1正在运行或者pending，那么流水线可能会被新流水打断.
> 假设 job1 -> job2 -> job3, 只有job1设置了 interruptible: true, 那么当有新流水线时, 要看当前流水线执行到了哪个阶段: 如果在job1阶段, 那么当前流水线都会被取消; 如果已经到了job2或job3阶段, 那么当前流水线不受影响, 会继续执行.

---

### timeout(全局和job)
timeout是用于设置一个任务的超时时间，
你也可以设置一个项目级别的超时时间。
```
build:
  script: build.sh
  timeout: 3 hours 30 minutes

test:
  script: rspec
  timeout: 3h 30m
```

---
### variables(全局和job)
variables可以让你在yaml文件中定义变量。然后在script或者执行的命中使用, 示例:
```
variables:
  DEPLOY_SITE: "https://example.com/"

deploy_job:
  stage: deploy
  script:
    - deploy-script --url $DEPLOY_SITE --path "/"

deploy_review_job:
  stage: deploy
  variables:
    REVIEW_PATH: "/review"
  script:
    - deploy-review-script --url $DEPLOY_SITE --path $REVIEW_PATH
```
变量名一般大写，使用时使用$加变量名

---
### retry(全局和job)
失败了之后重试, 值: 0, 1, 2, 如果是0表示第1次执行失败后不重试, 1表示第1次执行失败后重试1次, 2的话同理。
```
test:
  retry: 2
  script: echo 'test'
```
---
### 其它

其它的还有一些比较简单: stage, image, workflow.

一些不太常用: services, environment, dependencies, parallel, allow_failure, coverage, pages, release, resource_group等,

有兴趣可以自己去了解.