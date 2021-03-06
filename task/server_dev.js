export default (_opt) => {
    let gulp = _opt.gulp

    let         del = _opt.pluging.del,
             jshint = _opt.pluging.jshint,
            nodemon = _opt.pluging.nodemon,
        runSequence = _opt.pluging.runSequence

    const server = _opt.path.server
    const client = _opt.path.client
    const assets = _opt.path.assets

    gulp.task('server_dev', (cb) => {
        runSequence('server_clean', 'server_copy', 'server', 'server_watch', cb)
    })

    /**
     * server删除
     * @param  {[type]} 'server_clean' [description]
     * @param  {[type]} (              [description]
     * @return {[type]}                [description]
     */
    gulp.task('server_clean', () => {
        del([assets + '/config/**/*'])
        del([assets + '/controller/**/*'])
        del([assets + '/server/**/*'])
        del([assets + '/app.js'])
    })

    /**
     * server复制
     * @param  {[type]} 'server_copy' [description]
     * @param  {[type]} (             [description]
     * @return {[type]}               [description]
     */
    gulp.task('server_copy', () => {
        return gulp.src(server + '/**/*.js')
                   .pipe(jshint())
                   .pipe(gulp.dest(assets))
    })

    /**
     * 启动服务器
     * @param  {[type]} 'server' [description]
     * @param  {[type]} (        [description]
     * @return {[type]}          [description]
     */
    gulp.task('server', () => {
        return nodemon({
             script: assets + '/app.js',
             ignore: ['src/**', './*'],
            execMap: {
                    "js": "babel-node"
                },
                env: {'NODE_ENV': 'development'}
        })
    })

    gulp.task('server_reload', (cb) => {
        runSequence('server_copy', 'server', cb)
    })

    /**
     * 监听server
     * @param  {[type]} 'server_watch' [description]
     * @param  {[type]} (              [description]
     * @return {[type]}                [description]
     */
    gulp.task('server_watch', () => {
        gulp.watch(server + '/**/*', ['server_copy'])
    })
}
