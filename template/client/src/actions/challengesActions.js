export function getChallenges() {
    const challenges = fetch(`${process.env.API_HOST}/api/v1/challenges`)
        .then(res => {
            return res.json();
        })
        .then(res => {
            return res;
        })
        .catch(err => console.log(err));
    return { type: "GET_CHALLENGES", payload: challenges };
}
