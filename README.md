<h1 align="center">Budget Keeper</h1>

<p align="center">
  <img src="https://github.com/dawwson/budget-keeper-be/assets/45624238/ba7ab27e-f40b-4d24-9ea5-00b8590536b0" width="100%" height="300" />
</p>

<h2 align="center">Introduction</h2>
<p align="center">
    <code>Budget Keeper</code>는 사용자들이 개인 재무를 관리하고 지출을 추적하는 데 도움을 주는 서비스입니다.<br>월별로 예산을 설정하고 카테고리별로 지출 내역을 관리함으로써 사용자들의 재무 목표를 달성할 수 있습니다.
    <br>
    <br>
    <img src="https://img.shields.io/badge/E2E Test-Passing-2ade16?style=flat-square">
    <br>
    <br>
</p>

<h2 align="center">Skills</h2>
<p align="center">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white">
    <img src="https://img.shields.io/badge/Nest.js-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
    <img src="https://img.shields.io/badge/TypeORM-fcad03?style=for-the-badge">
    <br>
    <img src="https://img.shields.io/badge/PostgreSQL-00758F?style=for-the-badge&logo=postgresql&logoColor=white">
    <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white">
    <img src="https://img.shields.io/badge/jwt-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white">
    <br>
    <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/aws ec2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white">
    <img src="https://img.shields.io/badge/aws rds-527FFF?style=for-the-badge&logo=amazon-rds&logoColor=white">

</p>

<br>

## Table of Contents
- [Installation](#installation)
- [Directory](#directory)
- [ERD](#erd)
- [REST API](#rest-api)
- [Convention](#convention)
- [Architecture](#architecture)
- [Deployment Structure](#deployment-structure)
- [TIL & Retrospective](#til--retrospective)
- [Test Result](#test-result)

<br>

## Installation
```bash!
> npm install        # 패키지 설치
> npm run start:db   # 도커로 데이터베이스 실행
> npm run start:dev  # 개발버전 앱 실행
> npm run seed:dev   # 카테고리 데이터 생성
```

<br>

## Directory
<details>
    <summary>폴더 구조 보기</summary>
    <pre>
        <code>
src
├── api                # API 요청이 들어오는 Controller가 포함된 모듈
│   ├── auth           # 인증 모듈(/auth)
│   │   ├── dto
│   │   ├── service
│   │   └── strategy
│   ├── budget         # 예산 모듈(/budgets)
│   │   ├── dto
│   │   └── service
│   ├── category       # 카테고리 모듈(/categories)
│   │   ├── dto
│   │   └── service
│   └── expense        # 지출 모듈(/expenses)
│       ├── dto
│       ├── enum
│       ├── guard
│       └── service
├── config             # 환경 변수 설정 관련
├── database
│   └── seeding        # DB seeding 관련
├── entity
└── shared             # 여러 모듈에 걸쳐서 쓰이는 파일
    ├── enum
    ├── guard
    └── interface
test
├── e2e                # e2e 테스트 파일
├── in-memory-testing  # 인 메모리 DB 테스트 관련 파일
└── jest-e2e.json
        </code>
    </pre>
</details>

<br>

## ERD
![Budget Keeper](https://github.com/dawwson/budget-keeper-be/assets/45624238/d8fe946c-c933-41bb-9791-3edfe09047eb)
<details>
    <summary>테이블 설계 의도 보기</summary>
    <br>
    <b>사용자, 예산, 카테고리의 관계</b>
        <ul>
            <li>사용자는 여러 예산을 설정할 수 있습니다. 그리고 한 번 예산을 설정할 때 카테고리별 예산을 지정할 수 있으므로 예산과 카테고리는 다대다 관계입니다. 다대다 관계는 확장성과 유지보수 문제로 일반적으로 잘 사용하지 않으므로 중간 테이블<code>budget_category</code>을 두어 일대다, 다대일로 풀어냈습니다.</li>
            <ul>
                <li>사용자 : 예산 = <code>1:N</code></li>
                <li>예산 : 예산-카테고리 = <code>1:N</code></li>
                <li>예산-카테고리 : 카테고리 = <code>N:1</code></li>
            </ul>
        </ul>
    <b>사용자, 지출, 카테고리의 관계</b>
        <ul>
            <li>사용자는 여러 지출을 등록할 수 있으므로 일대다 관계입니다. 그리고 한 번 지출을 등록할 때 한 개의 카테고리를 지정할 수 있으므로 다대일 관계입니다.</li>
            <ul>
                <li>사용자 : 지출 = <code>1:N</code></li>
                <li>지출 : 카테고리 = <code>N:1</code></li>
            </ul>
        </ul>
</details>

<br>

## REST API
[자세한 내용은 GitHub Wiki로 이동! 🏃🏻‍♀️💨](https://github.com/dawwson/budget-keeper-be/wiki/1%EF%B8%8F%E2%83%A3-REST-API-%EB%AC%B8%EC%84%9C)

| Method | URL | Description | Authorization | Completed |
| :---: | --- | --- | :---: | :---: |
| `POST` | `/auth/sign-up` | 회원가입 | X | ✅ |
| `POST` | `/auth/sign-in` | 로그인 | X | ✅ |
| `GET` | `/categories` | 카테고리 목록 조회 | O | ✅ |
| `PUT` | `/budgets/{year}/{month}` | 월별 예산 설정 | O | ✅ |
| `GET` | `/budgets/{year}/{month}/recommendation` | 월별 예산 추천 | O | ✅ |
| `POST` | `/expenses` | 지출 생성 | O | ✅ |
| `PATCH` | `/expenses/{id}` | 지출 수정 | O | ✅ |
| `GET` | `/expenses/{id}` | 지출 상세 조회 | O | ✅ |
| `GET` | `/expenses` | 지출 목록 조회 | O | ✅ |
| `DELETE` | `/expenses/{id}` | 지출 삭제 | O | ✅ |
| `GET` | `/expenses/statistics` | 지출 통계 | O | ✅ |

<br>

## Convention
[자세한 내용은 GitHub Wiki로 이동! 🏃🏻‍♀️💨](https://github.com/dawwson/budget-keeper-be/wiki/2%EF%B8%8F%E2%83%A3-%EC%BB%A8%EB%B2%A4%EC%85%98)

<br>

## Architecture
<details>
    <summary>아키텍쳐 설계 의도 보기</summary>
    <br>
    <b>1. Custom Repository를 사용하지 않습니다.</b>
    <ul>
        <li><code>TypeORM</code> 0.3 버전부터 <code>@EntityRepository()</code> 데코레이터가 <code>deprecated</code>됨에 따라 여러 기술 블로그에서 <code>Custom Repository</code> 만드는 방법을 소개하고 있습니다. 하지만 따라서 적용하지 않은 이유는 다음과 같습니다. </li>
            <ul>
                <li>이미 <code>ORM</code>에서 제공하는 메서드를 한 번 더 추상화하게 되어, 요구사항이 늘어날수록 유지보수가 어려워진다고 느꼈습니다.</li>
                <li>향후 <code>ORM</code>의 교체를 고려하여 서비스 레이어에서의 <code>ORM</code>에 대한 의존성을 줄이기 위해 분리한다 하더라도, 현실적으로 한 번 정해진 <code>ORM</code>시스템을 교체하기는 어렵다고 생각했습니다. <code>ORM</code>마다 모델링 방법부터도 매우 다르기 때문입니다.</li>
                <li><code>Custom Repository</code>의 단위 테스트가 어려워집니다. <code>Repository</code>를 분리하게 되면 테스트의 목적은 <code>TypeORM</code>의 메소드가 잘 동작하는지 확인하는 것에 그치게 됩니다.</li>
            </ul>
        <li>대신 <code>NestJS</code>에서 제공하는 <code>@InjectRepository()</code>를 사용하여 <code>Repository Pattern</code>을 사용합니다.</li>
        <li>참고 자료</li>
        <ul>
            <li link><a href="https://youtu.be/6Tnq_e2MmVE?si=bdO-3-BLSGGnrc7Y">EF Core에서 Repository 패턴은 쓰지 말 것</a></li>
        </ul>
    </ul>
    <b>2. Service 계층 규칙</b>
    <ul>
        <li><code>Service</code> 계층에서는 여러 <code>Repository</code>를 주입받을 수 있습니다.</li>
        <li><code>Repository</code>는 <code>Service</code>에만 주입될 수 있습니다.</li>
        <li><code>Service</code>가 아닌 다른 <code>Provider</code>에서 데이터베이스 접근이 필요할 경우, <code>Repository</code>를 주입받아서 외부로 노출하는 <code>Provider</code>를 생성합니다.(함께 팀 프로젝트를 했던 <a href="https://github.com/kangssu">@kangssu</a>님의 아이디어를 좀 더 구체화시켰습니다 👍)
            <ul>
                <li>해당 <code>Provider</code>의 클래스명은 <code>{자원명}Lib</code>로 지정합니다.</li>
                <li>핵심 비즈니스 로직이 담긴 <code>Service</code>와 코드를 분리하고, 상위 레벨로 만들어서 데이터베이스 커넥션을 추상화하기 위함입니다.</li>
            </ul>
</li>
    </ul>
    <b>3. DTO는 어디서 변환하는가?</b>
    <ul>
        <li><code>clas-transformer</code>에서 제공하는 객체 매핑 데코레이터 및 함수를 활용합니다.</li>
        <li><code>Controller</code> ➡️ <code>Service</code></li>
            <ul>
                <li>요청 <code>DTO</code> 클래스의 함수에서 변환합니다</li>
                <li>함수명은 <code>to{서비스_DTO_이름}()</code>으로 지정합니다.</li>
            </ul>
        <li><code>Entity</code> ➡️ <code>Response</code></li>
            <ul>
                <li>응답 <code>DTO</code> 클래스의 <code>static</code> 함수에서 변환합니다</li>
                <li>함수명은 <code>of()</code>로 지정합니다.</li>
            </ul>
        <li>참고 자료</li>
        <ul>
            <a href="https://jojoldu.tistory.com/617">TypeScript 환경에서 class-transformer 적극적으로 사용하기</a>
        </ul>
    </ul>
</details>

<br>

## Deployment Structure
<img width="1082" alt="image" src="https://github.com/dawwson/budget-keeper-be/assets/45624238/28afc544-793d-40bd-8e04-4758ad12f91e">

- 로컬 개발 환경에서 프로덕션 환경변수를 설정하여 `Docker`기반으로 빌드합니다.
- `Docker Hub`에 빌드한 이미지를 업로드합니다.
- `EC2`에서 이미지를 내려받아서 실행합니다.
- `EC2`와 `RDS`는 동일한 `VPC` 내에서 다른 보안 그룹으로 설정하여 통신합니다.

<br>

## TIL & Retrospective
[자세한 내용은 GitHub Wiki로 이동! 🏃🏻‍♀️💨](https://github.com/dawwson/budget-keeper-be/wiki/3%EF%B8%8F%E2%83%A3-%08TIL-&-Retrospective)

- [[NestJS] in-memory 데이터베이스로 테스트 코드 작성하기(with pg-mem)](https://github.com/dawwson/budget-keeper-be/wiki/3%EF%B8%8F%E2%83%A3-%08TIL-&-Retrospective#-in-memory-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4%EB%A1%9C-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0with-pg-mem)
- [[Docker] 빌드 스테이지와 실행 스테이지 나누기](https://github.com/dawwson/budget-keeper-be/wiki/3%EF%B8%8F%E2%83%A3-%08TIL-&-Retrospective#-%EB%B9%8C%EB%93%9C-%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%80%EC%99%80-%EC%8B%A4%ED%96%89-%EC%8A%A4%ED%85%8C%EC%9D%B4%EC%A7%80-%EB%82%98%EB%88%84%EA%B8%B0)
- [[AWS] EC2 & RDS 환경 설정 방법](https://github.com/dawwson/budget-keeper-be/wiki/3%EF%B8%8F%E2%83%A3-%08TIL-&-Retrospective#1-6-aws)

<br>

## Test Result
- E2E 테스트 결과
<img width="335" alt="스크린샷 2023-11-21 오후 8 08 41" src="https://github.com/dawwson/budget-keeper-be/assets/45624238/75e2ba05-877b-44ee-97bb-01153b2be9d7">


<br>
<br>
<br>
<br>
