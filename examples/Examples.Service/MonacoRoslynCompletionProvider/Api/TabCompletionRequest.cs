﻿namespace MonacoRoslynCompletionProvider.Api
{
    public class TabCompletionRequest : IRequest
    {
        public TabCompletionRequest()
        { }

        public TabCompletionRequest(string code, int position, string[] assemblies) 
        {
            this.Code = code;
            this.Position = position;
            this.Assemblies = assemblies;
        }

        public virtual string Code { get; set; }

        public virtual int Position { get; set; }

        public virtual string[] Assemblies { get; set; }

    }
}
