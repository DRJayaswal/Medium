export default function getRepoName(url:String) {
    const match = url.match(/\/([^\/]+)\/?$/);
    return match ? match[1] : null;
}