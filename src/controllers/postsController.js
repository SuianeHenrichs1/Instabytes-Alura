import {getTodosPosts , criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js"

export async function listarPosts(req, res) { // Define uma rota GET para a URL /posts
    const posts = await getTodosPosts(); // Chama a função para obter todos os posts do banco de dados
    res.status(200).json(posts); // Envia os posts como resposta em formato JSON com status 200 (sucesso)params) 
    } 

export async function postarNovoPost(req, res) {
        const novoPost = req.body;
        try{
            const postCriado = await criarPost(novoPost);
            res.status(200).json(postCriado);
        } catch(erro) {
            console.error(erro.message);
            res.status(500).json({"Erro":"Falha na requisição"})

        }
    }

export async function uploadImagem(req, res) {
        const novoPost = req.body;
        try{
            const postCriado = await criarPost(novoPost);
            const imagemAtualizada = `uploads/${postCriado.insertedId}.png`
            fs.renameSync(req.file.path, imagemAtualizada)
            res.status(200).json(postCriado);
        } catch(erro) {
            console.error(erro.message);
            res.status(500).json({"Erro":"Falha na requisição"})

        }
    }

    export async function atualizarNovoPost(req, res) {
        const id = req.params.id; // Captura o 'id' da URL
        if (!id) {
            return res.status(400).json({ error: "ID é necessário para atualizar o post" });
        }
    
        const urlImagem = `http://localhost:3000/uploads/${id}.png`;
    
        try {
            const imgPath = `uploads/${id}.png`;
            if (!fs.existsSync(imgPath)) {
                return res.status(404).json({ error: "Imagem não encontrada" });
            }
    
            const imgBuffer = fs.readFileSync(imgPath);
            const descricao = await gerarDescricaoComGemini(imgBuffer);
    
            const post = {
                imgUrl: urlImagem,
                descricao: descricao,
                alt: req.body.alt,
            };
    
            const postCriado = await atualizarPost(id, post);
    
            res.status(200).json({
                message: "Post atualizado com sucesso!",
                data: postCriado,
            });
        } catch (erro) {
            console.error("Erro ao atualizar post:", erro.message);
            res.status(500).json({ error: "Falha ao atualizar post" });
        }
    }
    