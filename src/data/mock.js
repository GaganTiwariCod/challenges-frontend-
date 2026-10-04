const M = (n, d, p = 'Milestone') => Array.from({length: n}, (_, i) => ({n: `${p} ${i + 1}`, d: i < d}))
const js = ['Variables','Data Types','Operators','Conditions','Functions','Scope','Closures','Promises','Async/Await','Final Project']
export const seed = {
  me: 'Gagan', streak: 7, commits: 184, done: 12,
  ch: [
    {id:'1',t:'JavaScript Mastery',d:'Become comfortable with JavaScript in 30 days.',cat:'Coding',st:'active',left:13,ms:js.map((n,i)=>({n,d:i<4})),sk:6,cm:18,likes:24,own:true},
    {id:'2',t:'Read 12 Books',d:'One book a month, with notes.',cat:'Learning',st:'active',left:2,ms:M(12,9,'Book'),sk:3,cm:9,likes:11,own:true},
    {id:'3',t:'Run 5K Daily',d:'Build a running habit.',cat:'Fitness',st:'active',left:21,ms:M(20,4,'Run'),sk:4,cm:4,likes:7,own:true},
    {id:'4',t:'30 Days Coding',d:'Code every day for a month.',cat:'Coding',st:'completed',left:0,ms:M(30,30,'Day'),sk:30,cm:30,likes:56,own:true},
    {id:'5',t:'Early Wake Up',d:'Up at 5:30 every day.',cat:'Personal',st:'failed',left:0,ms:M(18,11,'Day'),sk:0,cm:11,likes:5,own:true},
    {id:'6',t:'30 Days of React',d:'Hooks, state, and a real project.',cat:'Coding',st:'active',left:15,ms:M(25,16),sk:12,cm:12,likes:120,by:'Rahul'},
    {id:'7',t:'Daily Yoga',d:'20 minutes every morning.',cat:'Fitness',st:'active',left:3,ms:M(21,17,'Session'),sk:17,cm:17,likes:64,by:'Priya'},
    {id:'8',t:'Learn Spanish',d:'Basics to simple conversation.',cat:'Learning',st:'active',left:24,ms:M(30,9,'Lesson'),sk:5,cm:9,likes:41,by:'Ankit'},
    {id:'9',t:'No Sugar Month',d:'A month without added sugar.',cat:'Personal',st:'completed',left:0,ms:M(30,30,'Day'),sk:30,cm:30,likes:88,by:'Meera'},
  ],
  feed: [
    {u:'Rahul',ago:'2h ago',c:'6',day:12,tx:'Today I finally understood closures.',cm:6,l:24},
    {u:'Priya',ago:'5h ago',c:'7',day:17,tx:'Sun salutations felt easy today. Added 5 minutes.',cm:3,l:18},
    {u:'Ankit',ago:'Yesterday',c:'8',day:9,tx:'Ordered coffee entirely in Spanish.',cm:8,l:31},
  ],
  log: {'1':[
    {id:'a',day:18,w:'TODAY',tx:'Completed closures and solved 10 practice problems.',l:12,cm:4},
    {id:'b',day:17,w:'YESTERDAY',tx:'Completed callbacks and higher-order functions.',l:8,cm:2},
    {id:'c',day:16,w:'OCT 15',tx:'Finished scope and the execution context.',l:6,cm:1}]},
  cmt: {'1':[
    {id:1,u:'Rahul',tx:'Keep going bro 🔥',l:4,p:0},{id:2,u:'Priya',tx:'Day 18 already! Nice consistency.',l:2,p:0},{id:3,u:'Gagan',tx:'Thanks both!',l:1,p:2}]},
  notes: [['❤️','Rahul liked your challenge','2m ago'],['💬','Priya commented on your commit','1h ago'],['🔥','You completed Day 10','Yesterday'],['🏆','Your challenge ends in 3 days','Yesterday'],['👤','Rahul joined your challenge','2 days ago']],
  likes: {},
}
