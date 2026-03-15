#!/bin/sh
# 简单猜数字小游戏

# 生成 1-100 的随机数
TARGET=$(( (RANDOM % 100) + 1 ))
COUNT=0

echo "欢迎来到猜数字小游戏！"
echo "我已经想好了 1-100 之间的一个数字，来猜吧！"

while :; do
  printf "你的猜测："
  read GUESS

  # 输入校验
  case "$GUESS" in
    ''|*[!0-9]*)
      echo "请输入一个整数。"
      continue
      ;;
  esac

  COUNT=$((COUNT + 1))

  if [ "$GUESS" -lt "$TARGET" ]; then
    echo "太小了！"
  elif [ "$GUESS" -gt "$TARGET" ]; then
    echo "太大了！"
  else
    echo "猜对了！你一共猜了 $COUNT 次。"
    break
  fi
done
