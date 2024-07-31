# --빌드 스테이지--
# 기반이 되는 이미지 레이어
FROM node:18 AS builder
# 작업 디렉토리 설정
WORKDIR /usr/app/source
# 앱의 소스 코드 복사
COPY . .
# 의존성 설치(package-lock.json 기준 & devDependencies 포함)
RUN npm ci
# 빌드
RUN npm run build

# --실행 스테이지--
# 기반이 되는 이미지 레이어
FROM node:18
# 작업 디렉토리 설정
WORKDIR /usr/app/build
# 빌드한 소스 코드 복사(실행에 필요한 것만)
COPY --from=builder /usr/app/source/package*.json .
COPY --from=builder /usr/app/source/dist ./dist
COPY --from=builder /usr/app/source/.env.prod .
# 의존성 설치(devDependencies 제외)
RUN npm ci --only=production
# 노출할 포트 지정
EXPOSE 5190
# 앱 실행
CMD ["npm", "run", "start"]