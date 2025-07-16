import express from 'express';
import Topic from '../models/Topic'; 

const app = express();


app.get('/api/topics/:id', async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);
    if (!topic) {
      return res.status(404).send('Topic not found');
    }
    res.json(topic); 
  } catch (error) {
    res.status(500).send('Error fetching topic');
  }
});
