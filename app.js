const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override')

const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(()=> {
        console.log("Mongo connection open")
    }).catch(err=>{
        console.log("Oh nooooo Mongo connection error!");
        console.log(err)
})
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, "connection error: "));
// db.once('open', ()=> {
//     console.log("Database Connected");
// });

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.get('/', (req, res)=>{
    res.render('home')
})

// 전체 목록
app.get('/campgrounds', async (req, res)=>{
    const campgrounds = await Campground.find({});
    console.log('plese help me')
    res.render('campgrounds/index', {campgrounds})
})

// 데이터 추가
app.get('/campgrounds/new', async (req, res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',async (req, res)=>{
    const newCampground = new Campground(req.body)
    await newCampground.save();
    res.redirect(`campgrounds/${newCampground._id}`)
})

// 데이터 조회 (개별))
app.get('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
})

// 데이터 수정
app.get('/campgrounds/:id/edit', async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

app.patch('/campgrounds/:id', async(req, res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body, {runValidators:true, new: true});
    res.redirect(`/campgrounds/${campground._id}`);
})

// 데이터 삭제
app.delete('/campgrounds/:id', async (req, res)=>{
    const {id} = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
})

// 포트 연결
app.listen(3000, () =>{
    console.log('Serving on 3000 Port')
})

