if [ -z $DOCKER_PASSWORD ]
then
  echo "skipping relogin because DOCKER_PASSWORD does not exist"
else
  docker logout
  echo $DOCKER_PASSWORD | docker login --username rabelais --password-stdin
fi

VERSION="0.26"
IMAGE_NAME="rabelais/portfolio_api" # private repo!
TAG_FIXED="${IMAGE_NAME}:${VERSION}"
TAG_LATEST="${IMAGE_NAME}:latest"
docker build -f prod.dockerfile -t $TAG_FIXED .
docker push $TAG_FIXED
docker tag $TAG_FIXED $TAG_LATEST
docker push $TAG_LATEST